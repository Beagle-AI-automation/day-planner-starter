#!/usr/bin/env node
/**
 * Safety scan - run this inside your Day Planner folder:   node quest/safety-scan.js
 *
 * Before you push, it looks for things that must never be in a public repo:
 * email addresses, phone numbers, roll or ID numbers, marks, and keys, tokens
 * or passwords. It reads the files git knows about (plus new files you have not
 * committed yet) and your last 50 commit messages. For every hit it prints
 * file:line, a masked sample, and a one-line fix. No-reply addresses and the
 * Co-authored-by / Signed-off-by lines an AI tool adds to a commit are not hits.
 *
 * It changes nothing and sends nothing. check.js runs it for you on every run.
 * No dependencies: Node only. Works on Node 18 or newer.
 *
 * Exit code: 0 when clean, 1 when something was found.
 * Options:   --json      machine-readable output
 *            --dir PATH  scan that folder instead of the current one
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const MAX_FILE_BYTES = 1024 * 1024; // anything bigger than 1 MB is not a source file; skip it
const COMMITS_TO_SCAN = 50;
const SKIP_DIRS = new Set(['.git', 'node_modules', '.cache']);
// Tooling files that contain the patterns themselves, and the two files check.js writes or reads.
const SKIP_FILES = new Set(['check.js', 'quest/safety-scan.js', 'quest/baseline.json', 'quest/progress.json']);
const BINARY_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip', '.gz', '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.mov', '.mp3', '.wav']);

// Addresses that are not a real person: the reserved example domains, GitHub's private no-reply address,
// and any no-reply / noreply mailbox (noreply@anthropic.com, noreply@github.com: what AI tools and bots sign with).
const SAFE_EMAIL = /@(?:[a-z0-9.-]+\.)?(?:example\.(?:com|org|net)|[a-z0-9-]+\.(?:invalid|test|example|localhost))$|@users\.noreply\.github\.com$/i;
const NO_REPLY = /^no-?reply@/i;
const safeEmail = (addr) => SAFE_EMAIL.test(addr) || NO_REPLY.test(addr);
// Commit trailers an AI tool or git -s adds by itself ("Co-authored-by: Tool <noreply@...>"); not something the learner typed.
const TRAILER_LINE = /^\s*(?:co-authored-by|signed-off-by)\s*:/i;

const ROTATE = 'A key, token or password must never be in the repo. Delete it, commit, and change it TODAY at the website that gave it to you: it stays in the git history even after you delete it. Message Adi directly about it, not in the shared channel.';
const SECRET_WORDS = /key|token|secret|passw|credential|authoriz|authent|\bauth\b/i; // not "author" (commit trailers say Co-Authored-By)

// Each rule: what it finds, the pattern (with the g flag), and the one-line fix.
// `needs` is an extra pattern the whole line must also match (used to keep the generic rule quiet).
const RULES = [
  { kind: 'email address',
    re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g,
    fix: 'Remove the email address. Nothing in the planner needs one.' },
  { kind: 'phone number',
    re: /(?<![\w.\/])(?:\+91[ -]?|0)?[6-9]\d{4}[ -]?\d{5}(?![\w.\/])/g,
    fix: 'Remove the phone number. Nothing in the planner needs one.' },
  { kind: 'roll or ID number',
    re: /\b(?:roll\s*(?:no|num|number)?|(?:reg(?:istration)?|enrol(?:l)?ment|admission|student|college|univ(?:ersity)?)\s*(?:no|num|number|id))\.?\s*[:=#-]?\s*(?=[A-Za-z\/-]*\d)[A-Za-z0-9][A-Za-z0-9\/-]{2,}/gi,
    fix: 'Remove the roll or ID number. Course names and dates are enough.' },
  // A result word followed by a VALUE: a separator or verb then a number ("marks: 78", "CGPA is 8.2"), or a bare
  // number that carries a decimal, a denominator or a percent sign ("CGPA 8.2", "marks 78/100", "percentage 92%").
  // A bare whole number is not enough: "Grade 3 record writing" is a class, not a result.
  { kind: 'marks or grade',
    re: /\b(?:marks?|cgpa|sgpa|gpa|percentage|percentile|grade)\b(?:(?:\s*(?:obtained|scored|of|is|was|were)\s*[:=-]?|\s*[:=-])\s*\d{1,3}(?:\.\d+)?\s*(?:\/\s*\d{1,3}|%)?|\s+\d{1,3}(?:\.\d+\b|\s*\/\s*\d{1,3}|\s*%))/gi,
    fix: 'Remove the marks or grade. The planner holds tasks and dates, not results.' },
  // A letter grade: "grade A", "Grade: B+", "grade O". Case-sensitive on purpose, so "grade a task" is not a result.
  { kind: 'marks or grade',
    re: /\b[Gg]rade\b\s*(?:obtained|scored|is|was)?\s*[:=-]?\s*[A-FOS][+-]?(?![A-Za-z0-9])/g,
    fix: 'Remove the marks or grade. The planner holds tasks and dates, not results.' },
  { kind: 'API key (sk-...)',
    re: /\bsk-(?:[a-z]+-)*[A-Za-z0-9_-]{20,}/g,
    fix: ROTATE },
  { kind: 'GitHub token',
    re: /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/g,
    fix: ROTATE },
  { kind: 'AWS access key',
    re: /\bAKIA[0-9A-Z]{16}\b/g,
    fix: ROTATE },
  { kind: 'Slack token',
    re: /\bxox[abprs]-[A-Za-z0-9-]{10,}/g,
    fix: ROTATE },
  { kind: 'Google API key',
    re: /\bAIza[0-9A-Za-z_-]{35}\b/g,
    fix: ROTATE },
  { kind: 'private key file',
    re: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/g,
    fix: ROTATE },
  { kind: 'password or token inside a URL',
    re: /\b[a-z][a-z0-9+.-]*:\/\/[^\s\/:@'"`]+:[^\s\/@'"`]+@[^\s'"`]+/gi,
    fix: 'Take the password or token out of the URL (for git: git remote set-url origin https://github.com/YOUR-USERNAME/REPO.git). ' + ROTATE },
  { kind: 'secret assigned in code',
    re: /\b(?:passw(?:or)?d|secret|api[_-]?key|access[_-]?token|auth[_-]?token|private[_-]?key)\s*[:=]\s*['"`][^'"`\s]{8,}['"`]/gi,
    fix: ROTATE },
  { kind: 'long key-like string next to key/token/secret',
    re: /(?<![A-Za-z0-9+\/=_-])(?=[A-Za-z0-9+\/=_-]*\d)[A-Za-z0-9+\/=_-]{32,}(?![A-Za-z0-9+\/=_-])/g,
    needs: SECRET_WORDS,
    fix: ROTATE },
];

// Show enough of a hit to find it, never the whole thing (the scan output gets pasted in chats).
function mask(s) {
  if (s.length <= 6) return s[0] + '***';
  return s.slice(0, 3) + '*'.repeat(Math.min(8, s.length - 5)) + s.slice(-2);
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

// The files to read: what git tracks plus new files not yet committed (ignored files are left out).
// Without git, every file under the folder except the usual junk.
function listFiles(root) {
  const r = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8', windowsHide: true });
  if (r.status === 0) return { files: r.stdout.split('\0').filter(Boolean), viaGit: true };
  const files = [];
  (function walk(dir) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (SKIP_DIRS.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) files.push(toPosix(path.relative(root, p)));
    }
  })(root);
  return { files, viaGit: false };
}

// The text of a file, or null when it is binary, huge, missing or unreadable.
function readText(root, rel) {
  if (BINARY_EXT.has(path.extname(rel).toLowerCase())) return null;
  let buf;
  try {
    const st = fs.statSync(path.join(root, rel));
    if (!st.isFile() || st.size > MAX_FILE_BYTES) return null;
    buf = fs.readFileSync(path.join(root, rel));
  } catch { return null; }
  if (buf.subarray(0, 8000).includes(0)) return null; // a NUL byte means binary
  return buf.toString('utf8');
}

function commitMessages(root) {
  const r = spawnSync('git', ['log', `-${COMMITS_TO_SCAN}`, '--format=%h%x1f%B%x1e'], { cwd: root, encoding: 'utf8', windowsHide: true });
  if (r.status !== 0) return [];
  return r.stdout.split('\x1e').map((s) => s.trim()).filter(Boolean).map((s) => {
    const cut = s.indexOf('\x1f');
    return { hash: s.slice(0, cut).trim(), body: s.slice(cut + 1) };
  });
}

// Every hit in one block of text. `where(lineNumber)` names the place for the report.
// In a commit message (`isCommit`), the Co-authored-by / Signed-off-by trailer lines are skipped.
function scanText(text, where, findings, isCommit = false) {
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (isCommit && TRAILER_LINE.test(line)) continue;
    for (const rule of RULES) {
      if (rule.needs && !rule.needs.test(line)) continue;
      rule.re.lastIndex = 0;
      let m = rule.re.exec(line);
      while (m && rule.kind === 'email address' && safeEmail(m[0])) m = rule.re.exec(line); // skip example and no-reply addresses
      if (!m) continue;
      findings.push({ where: where(i + 1), kind: rule.kind, sample: mask(m[0]), fix: rule.fix });
    }
  }
}

// The whole scan for one folder. Returns { clean, findings, filesChecked, commitsChecked, viaGit }.
function scan(root) {
  const findings = [];
  const { files, viaGit } = listFiles(root);
  let filesChecked = 0;
  for (const rel of files) {
    const posix = toPosix(rel);
    if (SKIP_FILES.has(posix)) continue;
    if (posix.split('/').some((part) => SKIP_DIRS.has(part))) continue;
    const text = readText(root, rel);
    if (text === null) continue;
    filesChecked += 1;
    scanText(text, (n) => `${posix}:${n}`, findings);
  }
  const commits = viaGit ? commitMessages(root) : [];
  for (const c of commits) {
    scanText(c.body, (n) => `commit ${c.hash} (message line ${n})`, findings, true);
  }
  return { clean: findings.length === 0, findings, filesChecked, commitsChecked: commits.length, viaGit };
}

function printReport(result) {
  if (result.clean) {
    console.log(`Safety scan: clean (${result.filesChecked} file${result.filesChecked === 1 ? '' : 's'}, ${result.commitsChecked} commit message${result.commitsChecked === 1 ? '' : 's'} checked).`);
    return;
  }
  const n = result.findings.length;
  console.log(`Safety scan: ${n} thing${n === 1 ? '' : 's'} to fix before you push`);
  for (const f of result.findings) {
    console.log(`  ${f.where}  ${f.kind}  "${f.sample}"`);
    console.log(`     fix: ${f.fix}`);
  }
  if (result.findings.some((f) => f.where.startsWith('commit '))) {
    console.log('  Commit messages cannot be edited after the fact. For the trial, leave them and keep future messages to what changed.');
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const dirIdx = args.indexOf('--dir');
  const root = dirIdx >= 0 && args[dirIdx + 1] ? path.resolve(args[dirIdx + 1]) : process.cwd();
  const result = scan(root);
  if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
  else printReport(result);
  process.exit(result.clean ? 0 : 1);
}

module.exports = { scan, printReport, RULES };
