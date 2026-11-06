#!/usr/bin/env node
/**
 * Quest check - run this inside your Day Planner folder:   node check.js
 *
 * It looks at YOUR folder and prints:
 *   - Setup: is Node new enough, is git installed, is this the planner folder, is origin your fork
 *   - the quest log: which days are done by the checks, your level and XP, what to do next
 *   - the safety scan: anything that must come out of the repo before you push
 *   - the evidence line to post in the shared channel, plus links to your fork and your last commit
 *
 * This file is the gate. There is no human marking step: Days 1 to 6 are done when
 * the checks here say they are done, and Day 7 you score yourself against the rubric.
 *
 * It never sends anything anywhere. The only network call is --url, which fetches
 * your own live site when you ask for it.
 *
 * Options:
 *   --json          machine-readable output (the same report as a data structure)
 *   --url <site>    also check Day 6: your live GitHub Pages site
 *   --stuck         print one block to paste in the shared channel when you are stuck
 *   --submit N      print the whole message to post for Day N
 *   --plain         ASCII markers instead of emoji (automatic on an old Windows console)
 *   --no-scan       skip the safety scan (not recommended)
 *
 * This file runs on Node 18 or newer, so it can tell you when Node is too old.
 * The tests themselves (node --test) need Node 22 or newer.
 */
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const ROOT = process.cwd();
const NODE_FLOOR = 22; // node --test with import/export needs 22 or newer
const TEMPLATE_OWNER = 'beagle-ai-automation'; // where the starter lives; a learner's origin must be their own fork
const CHECK_TODAY = new Date('2026-11-02T14:00:00'); // a fixed "today" for the Day 4 and Day 5 checks

const LEVELS = ['Visitor', 'Runner', 'Maker', 'Builder', 'Debugger', 'Tester', 'Shipper', 'Presenter'];
const QUESTS = [
  { day: 1, name: 'Run it', xp: 100 },
  { day: 2, name: 'Make it yours', xp: 100 },
  { day: 3, name: 'Add a feature with tests', xp: 150 },
  { day: 4, name: 'Find and fix the bug', xp: 200 },
  { day: 5, name: 'Make it robust', xp: 150 },
  { day: 6, name: 'Put it online', xp: 150 },
  { day: 7, name: 'Ship it', xp: 150 },
];

// ---- options ----------------------------------------------------------------
const args = process.argv.slice(2);
const has = (name) => args.includes(name);
const after = (name) => {
  const i = args.indexOf(name);
  const v = i >= 0 ? args[i + 1] : undefined;
  return v && !v.startsWith('--') ? v : null;
};
if (has('--help') || has('-h')) {
  console.log([
    'node check.js              quest log, setup check, safety scan, evidence line',
    'node check.js --url URL    also check Day 6 against your live site',
    'node check.js --stuck      one block to paste in the shared channel when you are stuck',
    'node check.js --submit N   the whole message to post for Day N',
    'node check.js --json       everything as JSON (the same report as data)',
    'node check.js --plain      ASCII markers instead of emoji',
  ].join('\n'));
  process.exit(0);
}
const JSON_OUT = has('--json');
const LIVE_URL = after('--url');
const STUCK = has('--stuck');
const SUBMIT = has('--submit') ? (parseInt(after('--submit'), 10) || 0) : null; // 0 means "the latest day"
const SCAN = !has('--no-scan');
// Old Windows consoles (cmd.exe, PowerShell outside Windows Terminal) show emoji as boxes, so use ASCII there.
const PLAIN = has('--plain') || (process.platform === 'win32' && !process.env.WT_SESSION);
const COLOR = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR && !JSON_OUT;

const M = PLAIN
  ? { done: '[x]', todo: '[ ]', next: '[>]', ok: '[ok]', warn: '[!!]', full: '#', empty: '.', sep: ' | ', bullet: '-', green: '[ok]', amber: '[..]', dash: '-' }
  : { done: '✅', todo: '⬜', next: '▶️ ', ok: '✅', warn: '⚠️ ', full: '█', empty: '░', sep: ' · ', bullet: '•', green: '✅', amber: '🟡', dash: '—' };
const paint = (code) => (s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : s);
const red = paint(31);
const green = paint(32);
const bold = paint(1);
const dim = paint(2);

// ---- small helpers ----------------------------------------------------------
const sha = (p) => (fs.existsSync(p) ? createHash('sha256').update(fs.readFileSync(p)).digest('hex') : null);
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const run = (cmd, a, opts = {}) => spawnSync(cmd, a, { cwd: ROOT, encoding: 'utf8', timeout: 120000, windowsHide: true, ...opts });
const out = (r) => (r && r.status === 0 && typeof r.stdout === 'string' ? r.stdout.trim() : '');
const hidePath = (s) => s.split(ROOT + path.sep).join('').split(ROOT).join('.'); // never print the full folder path: it can hold your name

// ---- git --------------------------------------------------------------------
// Understands the two ways GitHub gives you a clone address:
//   https://github.com/owner/repo.git   and   git@github.com:owner/repo.git
function parseRemote(remote) {
  const m = remote.match(/^(?:https?:\/\/(?:[^@\/]+@)?|git@|ssh:\/\/(?:[^@\/]+@)?)([^\/:]+)[\/:]([^\/]+)\/([^\/]+?)(?:\.git)?\/?$/i);
  if (!m) return null;
  const [, host, owner, repo] = m;
  const github = host.toLowerCase() === 'github.com';
  return { host, owner, repo, github, web: github ? `https://github.com/${owner}/${repo}` : null };
}

// GitHub Pages serves a fork at https://<owner>.github.io/<repo>/ (owner is always lower case there).
function pagesUrl(gh) {
  if (!gh || !gh.github) return null;
  const owner = gh.owner.toLowerCase();
  return gh.repo.toLowerCase() === `${owner}.github.io` ? `https://${owner}.github.io/` : `https://${owner}.github.io/${gh.repo}/`;
}

function gitInfo() {
  const version = out(run('git', ['--version'])).replace(/^git version\s*/i, '') || null;
  const inRepo = version !== null && out(run('git', ['rev-parse', '--is-inside-work-tree'])) === 'true';
  const info = {
    available: version !== null, version, inRepo, head: '', fullHead: '', count: 0, branch: '', remote: '', github: null,
    dirty: false, dirtyFiles: [], author: '', emails: [], userNameSet: false, last3: [], dates: [],
  };
  if (!inRepo) return info;
  info.head = out(run('git', ['rev-parse', '--short', 'HEAD']));
  info.fullHead = out(run('git', ['rev-parse', 'HEAD']));
  info.count = parseInt(out(run('git', ['rev-list', '--count', 'HEAD'])) || '0', 10);
  info.branch = out(run('git', ['rev-parse', '--abbrev-ref', 'HEAD']));
  // Never keep a password or token that someone typed into the clone address.
  info.remote = out(run('git', ['remote', 'get-url', 'origin'])).replace(/\/\/[^@\/]+@/, '//');
  info.github = parseRemote(info.remote);
  info.dirtyFiles = (run('git', ['status', '--porcelain']).stdout || '').split('\n').filter(Boolean).map((l) => l.slice(3).trim());
  info.dirty = info.dirtyFiles.length > 0;
  info.author = out(run('git', ['log', '-1', '--format=%an']));
  info.emails = out(run('git', ['log', '-400', '--format=%ae'])).split('\n').filter(Boolean);
  info.userNameSet = out(run('git', ['config', 'user.name'])).length > 0;
  info.last3 = out(run('git', ['log', '-3', '--date=short', '--format=%h %ad %s'])).split('\n').filter(Boolean);
  info.dates = out(run('git', ['log', '-400', '--date=short', '--format=%ad'])).split('\n').filter(Boolean);
  return info;
}

// Consecutive days with at least one commit, counting back from today (or from yesterday when
// you have not committed yet today, so the streak is still alive).
function commitStreak(dates) {
  const have = new Set(dates);
  if (!have.size) return 0;
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  if (!have.has(key(d))) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (have.has(key(d))) { streak += 1; d.setDate(d.getDate() - 1); }
  return streak;
}

// ---- setup (the Day 1 doctor) ----------------------------------------------
function checkSetup(git) {
  const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
  const nodeOk = nodeMajor >= NODE_FLOOR;
  const planner = ['index.html', 'logic.js'].every((f) => fs.existsSync(path.join(ROOT, f)));
  const items = [];
  items.push(nodeOk
    ? { ok: true, text: `Node ${process.versions.node}` }
    : { ok: false, text: `Node ${process.versions.node} is too old: the tests need Node ${NODE_FLOOR} or newer. Install the LTS from nodejs.org, close EVERY terminal window, open a new one, then run: node --version` });
  items.push(git.available
    ? { ok: true, text: `git ${git.version}` }
    : { ok: false, text: 'git not found. Install it from git-scm.com, close every terminal window, open a new one, then run: git --version' });
  items.push(planner
    ? { ok: true, text: `this folder is the planner (${path.basename(ROOT)})` }
    : { ok: false, text: 'logic.js is not here, so this is not the planner folder. In the terminal, cd into your day-planner folder, then run node check.js again' });
  let fork;
  if (!git.available) fork = { ok: false, text: 'fork: cannot check without git' };
  else if (!git.inRepo) fork = { ok: false, text: 'this folder is not a git repository. Open a Codespace on your fork (Day 1, Step 3) and run this there' };
  else if (!git.remote) fork = { ok: false, text: 'no origin remote: this folder is not connected to GitHub yet. Open a Codespace on your fork (Day 1, Step 3) and run this there' };
  else if (!git.github) fork = { ok: false, text: `origin is an address this tool does not understand: ${git.remote}` };
  else if (!git.github.github) fork = { ok: false, text: `origin is on ${git.github.host}, not github.com. Day 6 (GitHub Pages) needs a fork on github.com` };
  else if (git.github.owner.toLowerCase() === TEMPLATE_OWNER) fork = { ok: false, text: `origin is the Beagle starter itself (${git.github.web}), not your fork. On github.com press Fork (top right of the starter page), then open a Codespace on YOUR fork (Code, Codespaces, Create codespace on main)` };
  else fork = { ok: true, text: `fork: ${git.github.web}` };
  items.push(fork);
  return { ok: items.every((i) => i.ok), nodeOk, node: process.versions.node, git: git.version, planner, fork: fork.ok ? git.github.web : null, items };
}

// ---- the learner's code and tests -------------------------------------------
function countCases() {
  const src = read(path.join(ROOT, 'tests', 'cases.js')) + read(path.join(ROOT, 'tests', 'logic.test.js'));
  const m = src.match(/\bname\s*:\s*['"`]|\btest\(\s*['"`]/g);
  return m ? m.length : 0;
}

async function loadLogic() {
  const p = path.join(ROOT, 'logic.js');
  if (!fs.existsSync(p)) return null;
  try {
    const mod = await import(pathToFileURL(p).href + `?t=${Date.now()}`);
    return typeof mod.planToday === 'function' || !mod.default ? mod : mod.default; // CommonJS or ES module, both fine
  } catch (e) { return { __error: hidePath(String(e)) }; }
}

function runTests() {
  if (!fs.existsSync(path.join(ROOT, 'tests'))) return { ok: false, passed: 0, failed: null, failing: [], firstError: 'no tests/ folder', out: '' };
  const r = run(process.execPath, ['--test'], { timeout: 180000 });
  const text = (r.stdout || '') + (r.stderr || '');
  const fail = text.match(/^(?:#|ℹ)\s*fail (\d+)/m);
  const pass = text.match(/^(?:#|ℹ)\s*pass (\d+)/m);
  // Failing test names. The TAP reporter prints "not ok 3 - name"; the spec reporter prints "✖ name (1.2ms)",
  // once inline and once more under a "✖ failing tests:" heading, so names are de-duplicated.
  const failing = [];
  for (const m of text.matchAll(/^\s*(?:not ok \d+ - |✖ )(.+?)(?:\s+#.*|\s+\(\d+(?:\.\d+)?ms\))?$/gm)) {
    const name = hidePath(m[1].trim());
    if (name !== 'failing tests:' && !failing.includes(name)) failing.push(name);
  }
  // The first error message: TAP writes "error: '...'" in a YAML block, spec writes a "SomeError: ..." line.
  const err = text.match(/^\s*error:\s*['"]?(.+?)['"]?\s*$/m) || text.match(/^\s*((?:[A-Za-z]*Error)\b:?[^\n]*)$/m);
  return {
    ok: r.status === 0 && !!fail && fail[1] === '0',
    passed: pass ? +pass[1] : 0,
    failed: fail ? +fail[1] : null,
    failing,
    firstError: err ? hidePath(err[1].trim()).slice(0, 160) : null,
    out: text,
  };
}

// ---- safety scan ------------------------------------------------------------
// The scanner lives in quest/safety-scan.js in the starter (and next to this file in the source tree).
function runSafetyScan() {
  const result = { ran: false, clean: true, findings: [], filesChecked: 0, commitsChecked: 0, error: null };
  if (!SCAN) return result;
  const candidates = [path.join(ROOT, 'quest', 'safety-scan.js'), path.join(__dirname, 'safety-scan.js'), path.join(__dirname, 'quest', 'safety-scan.js')];
  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) { result.error = 'quest/safety-scan.js not found'; return result; }
  try {
    const scanner = require(file);
    Object.assign(result, scanner.scan(ROOT), { ran: true });
  } catch (e) { result.error = hidePath(String(e)); }
  return result;
}

// ---- the seven quests -------------------------------------------------------
async function checkQuests({ git, setup, base, prev, L, logicError, tests, cases, safety, pages }) {
  const notes = [];
  const done = {};
  let live = null;

  // Day 1 - Run it: files present, logic loads, tests green.
  const files = ['index.html', 'app.js', 'logic.js', 'app.css', 'sample-data.js'].every((f) => fs.existsSync(path.join(ROOT, f)));
  done[1] = files && !!L && tests.ok;
  if (!files) notes.push('Day 1: some starter files are missing. Run node check.js in the planner folder, the one with logic.js in it.');
  else if (!L) notes.push(`Day 1: logic.js does not load: ${logicError || 'unknown error'}`);
  else if (!tests.ok && !setup.nodeOk) notes.push(`Day 1: the tests cannot run on Node ${process.versions.node}. See Setup above: install Node ${NODE_FLOOR} or newer, open a new terminal, then run node --test again.`);
  else if (!tests.ok) notes.push(`Day 1: tests are not green yet (${tests.failed ?? '?'} failing). Run: node --test`);

  // Day 2 - Make it yours: index.html or sample data changed from the starter, colours changed, and committed.
  if (base) {
    const changedIndex = sha(path.join(ROOT, 'index.html')) !== base.files['index.html'];
    const changedData = sha(path.join(ROOT, 'sample-data.js')) !== base.files['sample-data.js'];
    const changedCss = sha(path.join(ROOT, 'app.css')) !== base.files['app.css'];
    // Commits the learner made: the ones not written by the starter's own author address (recorded in the
    // baseline), so later commits to the starter never count. Older baselines fall back to a plain count.
    const learnerCommits = base.starterAuthorEmail
      ? git.emails.filter((e) => e.toLowerCase() !== String(base.starterAuthorEmail).toLowerCase()).length
      : Math.max(0, git.count - (base.commits || 0));
    const newCommit = git.inRepo && learnerCommits > 0;
    done[2] = done[1] && (changedIndex || changedData) && changedCss && newCommit;
    if (done[1] && !done[2]) notes.push('Day 2: change the title or your tasks AND the colours in app.css, then commit. (' +
      `${changedIndex ? 'title/html changed' : 'html unchanged'}, ${changedData ? 'tasks changed' : 'tasks unchanged'}, ${changedCss ? 'colours changed' : 'colours unchanged'}, ${newCommit ? 'new commit found' : 'no new commit yet'})`);
  } else {
    done[2] = false;
    notes.push('quest/baseline.json is missing, so Day 2 cannot be checked. Pull the latest starter.');
  }

  // Day 3 - Done tasks are ignored by the plan and the summary, and there are more tests than the starter had.
  let day3 = false;
  if (L && typeof L.planToday === 'function' && typeof L.summarise === 'function') {
    try {
      const t = [
        { id: 'a', course: 'X', title: 'Done but overdue exam', type: 'exam', due: '2026-10-30', hours: 1, done: true },
        { id: 'b', course: 'X', title: 'Open record', type: 'record', due: '2026-11-04', hours: 1, done: false },
      ];
      const plan = L.planToday(t, new Date('2026-11-02T00:00:00'), 5);
      const sum = L.summarise(t, new Date('2026-11-02T00:00:00'));
      const planIgnoresDone = Array.isArray(plan.chosen) && !plan.chosen.some((x) => x.id === 'a') && !(plan.deferred || []).some((x) => x.id === 'a');
      const sumIgnoresDone = sum && sum.overdue === 0 && sum.dueThisWeek === 1; // a done task is not overdue; total may still count it
      const moreTests = base ? cases > (base.cases || 0) : true;
      day3 = planIgnoresDone && sumIgnoresDone && moreTests;
      if (done[2] && !day3) notes.push(`Day 3: ${planIgnoresDone ? 'plan ignores done tasks' : 'planToday still includes a done task'}; ${sumIgnoresDone ? 'counts ignore done tasks' : 'summarise still counts a done task as overdue or due this week'}; tests ${cases} (starter had ${base?.cases ?? '?'}). Write the tests first, then make them pass.`);
    } catch (e) { notes.push(`Day 3: calling planToday/summarise threw: ${e.message}`); }
  }
  done[3] = done[2] && day3 && tests.ok;

  // Day 4 - The badge bug is fixed: a task due tomorrow, checked at 14:00 today, is 1 day away; a task due
  // today is 0 days away late at night AND early in the morning; yesterday is -1.
  // The note names the symptom, never the fix.
  let day4 = false;
  if (L && typeof L.daysUntil === 'function') {
    try {
      const probes = [
        { due: '2026-11-03', today: CHECK_TODAY, want: 1, say: "daysUntil('2026-11-03', today at 14:00)", why: 'tomorrow is 1 day away' },
        { due: '2026-11-02', today: new Date('2026-11-02T23:30:00'), want: 0, say: "daysUntil('2026-11-02', today at 23:30)", why: 'a task due today is 0 days away, even late at night' },
        { due: '2026-11-02', today: new Date('2026-11-02T02:00:00'), want: 0, say: "daysUntil('2026-11-02', today at 02:00)", why: 'a task due today is 0 days away, even early in the morning' },
        { due: '2026-11-01', today: CHECK_TODAY, want: -1, say: "daysUntil('2026-11-01', today at 14:00)", why: 'yesterday is -1' },
      ];
      const bad = probes.map((p) => ({ ...p, got: L.daysUntil(p.due, p.today) })).find((p) => p.got !== p.want);
      day4 = !bad;
      if (done[3] && bad) notes.push(`Day 4: the badge is still off. ${bad.say} returns ${bad.got} but ${bad.why}. Write the failing test first.`);
    } catch (e) { notes.push(`Day 4: daysUntil threw: ${e.message}`); }
  }
  done[4] = done[3] && day4 && tests.ok;

  // Day 5 - Robust: bad dates give NaN, empty lists do not throw, the UI has its two messages, tests grew again:
  // more cases than when Day 3 was marked done (quest/progress.json remembers that count); without that record,
  // more than the starter's count plus one.
  let day5 = false;
  if (L) {
    try {
      const nan = Number.isNaN(L.daysUntil('31/12/2026', CHECK_TODAY)) && Number.isNaN(L.daysUntil('', CHECK_TODAY));
      const empty = L.planToday([], CHECK_TODAY, 3);
      const emptyOk = empty && Array.isArray(empty.chosen) && empty.chosen.length === 0 && L.summarise([], CHECK_TODAY).total === 0;
      const html = read(path.join(ROOT, 'index.html')) + read(path.join(ROOT, 'app.js'));
      const emptyState = /no tasks|add your first|nothing (due|planned)|empty/i.test(html);
      const invalidMsg = /check the date|invalid date|not a valid date/i.test(html);
      const day3Cases = Number.isInteger(prev.day3Cases) ? prev.day3Cases : null;
      const day4Cases = Number.isInteger(prev.day4Cases) ? prev.day4Cases : null;
      const need = day4Cases !== null ? day4Cases : day3Cases !== null ? day3Cases : base ? (base.cases || 0) + 1 : null;
      const grew = need === null || cases > need;
      day5 = nan && emptyOk && emptyState && invalidMsg && grew;
      if (done[4] && !day5) notes.push(`Day 5: ${nan ? 'bad dates give NaN' : 'daysUntil must return NaN for a bad date'}; ${emptyOk ? 'empty list OK' : 'empty task list must not throw'}; ${emptyState ? 'empty-state text found' : 'add a friendly empty-state message in the UI'}; ${invalidMsg ? 'invalid-date message found' : 'show "check the date" for a bad date'}; tests ${cases}${grew ? '' : ` (need more than ${need}${day4Cases !== null ? ', the count when Day 4 was done' : day3Cases !== null ? ', the count when Day 3 was done' : ''})`}.`);
    } catch (e) { notes.push(`Day 5: robustness check threw: ${e.message}`); }
  }
  done[5] = done[4] && day5 && tests.ok;

  // Day 6 - Online: a github.com fork, a clean tree, a clean safety scan, and (with --url) the live page carries your title.
  let day6 = false;
  if (git.inRepo && git.github && git.github.github && !git.dirty) {
    if (!LIVE_URL && prev.lastLive && prev.lastLive.ok && prev.lastLive.head === git.fullHead) {
      // The last run with --url passed on this same commit: keep Day 6 ticked without fetching again.
      live = { ...prev.lastLive, remembered: true };
      day6 = true;
    } else if (LIVE_URL) {
      try {
        const res = await fetch(LIVE_URL, { redirect: 'follow' });
        const body = await res.text();
        const title = (read(path.join(ROOT, 'index.html')).match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim();
        live = { status: res.status, hasTitle: !!title && body.includes(title), url: LIVE_URL, head: git.fullHead };
        day6 = res.ok && live.hasTitle;
        live.ok = day6;
        if (!day6) notes.push(`Day 6: ${LIVE_URL} answered ${res.status}${live.hasTitle ? '' : ' and does not contain your <title>'}. Check Settings > Pages and wait a minute after pushing.`);
      } catch (e) { notes.push(`Day 6: could not fetch ${LIVE_URL}: ${e.message}`); }
    } else if (done[5]) notes.push(`Day 6: push, turn on GitHub Pages (Settings > Pages > Deploy from a branch > main, / (root)), wait a minute, then run: node check.js --url ${pages || 'https://<you>.github.io/<repo>/'}`);
  } else if (done[5]) {
    notes.push(`Day 6: ${!git.inRepo ? 'this folder is not a git repository' : git.dirty ? 'commit and push your changes first' : 'origin must be your fork on github.com'}.`);
  }
  if (done[5] && day6 && !safety.clean) notes.push(`Day 6: the safety scan found ${safety.findings.length} thing${safety.findings.length === 1 ? '' : 's'} to remove (see above). Remove, commit, push, then run again.`);
  done[6] = done[5] && day6 && safety.clean;

  // Day 7 - Ship it: you score this one yourself against the rubric. Nothing here can check a
  // self-score, so it stays open in the quest log; that is not a missing verdict from anyone.
  done[7] = false;

  return { done, notes, live };
}

// ---- output -----------------------------------------------------------------
function printLog(R) {
  const lines = ['', bold(`Day Planner ${M.dash} quest log`), ''];
  lines.push(bold('Setup'));
  for (const i of R.setup.items) lines.push(`  ${i.ok ? M.ok : red(M.warn)} ${i.text}`);
  lines.push('');
  const bar = QUESTS.map((q) => (R.done[q.day] ? M.full : M.empty)).join('');
  lines.push(`${bar}  level ${R.level} ${R.levelName}${M.sep}${R.xp} XP`, '');
  for (const q of QUESTS) {
    const mark = R.done[q.day] ? M.done : (R.next && R.next.day === q.day ? M.next : M.todo);
    lines.push(`${mark} Day ${q.day} ${q.name}${q.day === 7 ? ' (you score this one yourself)' : ''}`);
  }
  if (!R.safety.clean) {
    const n = R.safety.findings.length;
    lines.push('', red(`${M.warn} Safety: ${n} thing${n === 1 ? '' : 's'} to remove before you push (details: node quest/safety-scan.js)`));
    for (const f of R.safety.findings.slice(0, 5)) lines.push(red(`  ${f.where}  ${f.kind}  "${f.sample}"`));
    if (n > 5) lines.push(red(`  ...and ${n - 5} more`));
  } else if (R.safety.ran) {
    lines.push('', `${M.ok} Safety scan: clean (${R.safety.filesChecked} file${R.safety.filesChecked === 1 ? '' : 's'}, ${R.safety.commitsChecked} commit message${R.safety.commitsChecked === 1 ? '' : 's'})`);
  } else if (R.safety.error) {
    lines.push('', `${M.warn} Safety scan did not run: ${R.safety.error}`);
  }
  const todo = [...R.notes];
  if (!R.tests.ok) todo.push('Stuck? Run node check.js --stuck and paste the block in the shared channel.');
  if (todo.length) { lines.push('', 'What to do next:'); for (const n of todo) lines.push(`  ${M.bullet} ${n}`); }
  if (R.flipped) {
    lines.push('', green(`Day ${R.flipped} is done by the checks. Post the evidence line, then start Day ${R.flipped + 1} now.`));
    lines.push('That is the whole gate: these checks decide it, so there is nobody to wait for.');
  }
  if (R.next) lines.push('', `Next quest: days/day-${R.next.day}.md`);
  if (R.links.fork) lines.push(`Your fork:   ${R.links.fork}`);
  if (R.links.commit) lines.push(`Last commit: ${R.links.commit}`);
  if (R.changed.length) lines.push(`Changed since the starter: ${R.changed.join(', ')}`);
  lines.push('', 'Post this in the shared channel:', `  ${R.evidence}`, dim(`  (the whole message for the day: node check.js --submit ${R.evidenceDay})`), dim('  (stuck? node check.js --stuck prints one block to paste in the shared channel)'), '');
  console.log(lines.join('\n'));
}

function printStuck(R, git, tests) {
  const osName = { darwin: 'macOS', win32: 'Windows', linux: 'Linux' }[os.platform()] || os.platform();
  const L = ['----- copy from here -----'];
  // Which day you are on. While the tests are red (the red phase of Day 3, 4 or 5 is meant to look like this)
  // every quest reads "not done", so use the last run with green tests: its highest done day, plus one.
  let stuck = R.next || { day: 7, name: 'Ship it' };
  if (!tests.ok) {
    const lastGreen = QUESTS.filter((q) => R.greenDone && R.greenDone[q.day]).map((q) => q.day);
    if (lastGreen.length) stuck = QUESTS.find((q) => q.day === Math.min(Math.max(...lastGreen) + 1, 7));
  }
  L.push(`Stuck on: Day ${stuck.day} ${stuck.name} ${M.dash} [what you were trying to do, one line]`);
  L.push('What happened: [paste the error here, with the 3 lines above it]');
  L.push(`OS: ${osName} ${os.release()} ${os.arch()}${M.sep}Node ${process.versions.node}${M.sep}git ${git.version || 'not found'}${git.available ? ` (user.name set: ${git.userNameSet ? 'yes' : 'no'})` : ''}`);
  L.push(`Folder: ${path.basename(ROOT)} (planner files: ${R.setup.planner ? 'yes' : 'no'})${git.inRepo ? `${M.sep}branch ${git.branch || '?'}${M.sep}${git.count} commit${git.count === 1 ? '' : 's'}` : `${M.sep}not a git repository`}`);
  if (git.last3.length) { L.push('Last 3 commits:'); for (const c of git.last3) L.push(`  ${c}`); }
  L.push(`Tests: ${tests.passed ?? 0} pass / ${tests.failed ?? '?'} fail${tests.failed === null ? ' (node --test did not finish)' : ''}`);
  if (tests.failing.length) L.push(`Failing: ${tests.failing.slice(0, 5).join('; ')}${tests.failing.length > 5 ? ` (+${tests.failing.length - 5} more)` : ''}`);
  if (tests.firstError) L.push(`First error: ${tests.firstError}`);
  if (git.dirtyFiles.length) L.push(`Changed, not committed: ${git.dirtyFiles.slice(0, 8).join(', ')}${git.dirtyFiles.length > 8 ? ` (+${git.dirtyFiles.length - 8} more)` : ''}`);
  if (!R.safety.clean) L.push(`Safety scan: ${R.safety.findings.length} finding(s); run node quest/safety-scan.js`);
  L.push(`Quest log: ${R.evidence}`);
  L.push('----- to here -----');
  console.log(L.join('\n'));
}

// What each day asks you to post, from the Submit list in days/day-N.md.
function submitLines(day, R) {
  const shot = (what) => `[screenshot: ${what}]`;
  const commit = R.links.commit || '[commit link: on github.com open your fork, click the commits count, click your latest commit, copy the address that contains /commit/]';
  const fork = R.links.fork || '[link to your fork: github.com/YOUR-USERNAME/day-planner-starter]';
  const live = LIVE_URL || R.pagesUrl || '[your live URL]';
  const noData = "[run node quest/safety-scan.js until it says clean, then read sample-data.js, the title and git log yourself for people's names (the scan cannot see names). Then write: No personal data: checked data file, title, commit messages, full-folder search.]";
  switch (day) {
    case 1: return [shot('the app open in your Codespace preview'), shot('the green tests, fail 0'), 'My three sentences about planToday: [1] [2] [3]', `Fork: ${fork}`];
    case 2: return [`Commit: ${commit}`, shot('the app with your name, your colours and your tasks'), 'Badge note: [does the days-left badge agree with the due date? one line]'];
    case 3: return [shot('the red run, before the change to logic.js'), shot('the green run after'), `Commit (must include tests/cases.js): ${commit}`, shot("a task ticked and greyed, missing from Today's plan")];
    case 4: return ['[red run before the fix: screenshot or pasted text]', '[green run after the fix: screenshot or pasted text]', `Commit (must include tests/cases.js and logic.js): ${commit}`, 'Root cause in three sentences: [1] [2] [3]'];
    case 5: return [`Commit: ${commit}`, '[test output showing fail 0]', 'Red before my change: [which of the four tests, or none]', shot('a task whose badge says check the date'), shot('the empty state')];
    case 6: return [`Live: ${live}`, shot('the planner on your phone'), noData];
    case 7: return [`Live: ${live}`, `Fork: ${fork}`, 'Self-score: [one line per day, Day 1 to Day 7: met / not met, from the rubric in days/day-7.md]', 'What I would build next: [one line]', 'One thing I still do not fully understand: [one line]', 'Decision: [continue / not now / undecided]'];
    default: return [];
  }
}

function printSubmit(R, day) {
  if (day < 1 || day > 7) { console.log('Pick a day from 1 to 7: node check.js --submit 3'); return; }
  const L = [];
  if (day < 7 && !R.done[day]) L.push(`(The checks do not show Day ${day} as done yet; run node check.js to see what is missing. Fix that first: the checks are the gate, so the day is not done until they say so.)`, '');
  L.push(`Day ${day} ${M.dash} done`);
  L.push(R.evidence);
  L.push(...submitLines(day, R));
  L.push('Hardest part today: [one line]');
  console.log(L.join('\n'));
}

// ---- main -------------------------------------------------------------------
async function main() {
  const git = gitInfo();
  const setup = checkSetup(git);
  const base = readJson(path.join(ROOT, 'quest', 'baseline.json'));
  // The previous run (quest/progress.json): which days were done then, and the test count when Day 3 was done.
  const progressPath = path.join(ROOT, 'quest', 'progress.json');
  const prev = readJson(progressPath) || {};
  const logic = await loadLogic();
  const L = logic && !logic.__error ? logic : null;
  const tests = runTests();
  const cases = countCases();
  const safety = runSafetyScan();
  const pages = pagesUrl(git.github);
  const { done, notes, live } = await checkQuests({ git, setup, base, prev, L, logicError: logic && logic.__error, tests, cases, safety, pages });

  // +10 XP per test beyond the starter. Without quest/baseline.json there is nothing to count from, so no bonus.
  const bonus = base ? Math.max(0, cases - (base.cases || 0)) * 10 : 0;
  const xp = QUESTS.filter((q) => done[q.day]).reduce((s, q) => s + q.xp, 0) + bonus;
  const level = QUESTS.filter((q) => done[q.day]).length;
  const next = QUESTS.find((q) => !done[q.day]);
  const evidenceDay = next ? Math.max(next.day - 1, 1) : 7;
  const streak = commitStreak(git.dates);
  const evidence = `Day ${evidenceDay} ${level ? M.green : M.amber} level ${level} ${LEVELS[level]}${M.sep}${xp} XP${M.sep}tests ${tests.passed ?? 0} pass/${tests.failed ?? '?'} fail${M.sep}commit ${git.head || 'none'}`
    + (streak ? `${M.sep}streak ${streak} day${streak === 1 ? '' : 's'}` : '')
    + (live ? `${M.sep}live ${live.status}` : '');
  // Links only when the Setup block accepted origin as the learner's own fork on github.com.
  const links = {
    fork: setup.fork,
    commit: setup.fork && git.fullHead ? `${setup.fork}/commit/${git.fullHead}` : null,
  };
  const changed = base ? Object.keys(base.files).filter((f) => sha(path.join(ROOT, f)) !== base.files[f]) : [];
  if (base && cases > (base.cases || 0)) changed.push(`tests (+${cases - base.cases})`);

  // "Flipped" means done now and not done at the previous run (or no previous run).
  const prevDone = prev.done || {};
  const newlyDone = QUESTS.filter((q) => done[q.day] && !prevDone[q.day]).map((q) => q.day);
  const flipped = newlyDone.length ? Math.max(...newlyDone) : null;
  // Remembered from run to run: the test count the first time Day 3 was done (Day 5 must grow past it), and
  // the done map of the last run with green tests (so --stuck knows which day you are on while tests are red).
  const day3Cases = Number.isInteger(prev.day3Cases) ? prev.day3Cases : (done[3] ? cases : null);
  const day4Cases = Number.isInteger(prev.day4Cases) ? prev.day4Cases : (done[4] ? cases : null);
  const lastLive = live && live.ok ? { ok: true, status: live.status, hasTitle: live.hasTitle, url: live.url, head: live.head } : (prev.lastLive || null);
  const greenDone = tests.ok ? done : (prev.greenDone || prev.done || {});

  const report = {
    checkedAt: new Date().toISOString(),
    level, levelName: LEVELS[level], xp, done,
    tests: { ok: tests.ok, passed: tests.passed, failed: tests.failed, cases, failing: tests.failing },
    git: { inRepo: git.inRepo, head: git.head, count: git.count, branch: git.branch, remote: git.remote, dirty: git.dirty, author: git.author },
    setup: { ok: setup.ok, node: setup.node, nodeOk: setup.nodeOk, git: setup.git, planner: setup.planner, fork: setup.fork, items: setup.items },
    links, pagesUrl: pages, changed, streak,
    safety: { ran: safety.ran, clean: safety.clean, findings: safety.findings, filesChecked: safety.filesChecked, commitsChecked: safety.commitsChecked, error: safety.error },
    live,
    next: next ? { day: next.day, name: next.name, file: `days/day-${next.day}.md` } : null,
    notes, flipped, evidenceDay, evidence, day3Cases, day4Cases, lastLive, greenDone,
  };
  if (!STUCK && SUBMIT === null) {
    try { fs.mkdirSync(path.join(ROOT, 'quest'), { recursive: true }); fs.writeFileSync(progressPath, JSON.stringify(report, null, 2)); } catch {}
  }

  if (JSON_OUT) { console.log(JSON.stringify(report, null, 2)); return; }
  if (STUCK) { printStuck(report, git, tests); return; }
  if (SUBMIT !== null) { printSubmit(report, SUBMIT || evidenceDay); return; }
  printLog(report);
}

main().catch((e) => { console.error('check.js crashed:', hidePath(String(e && e.stack || e))); process.exit(1); });
