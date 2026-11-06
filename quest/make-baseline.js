#!/usr/bin/env node
// Run ONCE in the starter repo before publishing it:  node quest/make-baseline.js
// Records what the untouched starter looks like so check.js can tell when a learner has changed it.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const ROOT = process.cwd();
if (existsSync(path.join(ROOT, 'quest', 'baseline.json')) && !process.argv.includes('--force')) {
  console.log('quest/baseline.json already exists, so nothing changed. Only the person publishing the starter runs this.');
  process.exit(0);
}
const sha = (p) => existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex') : null;
const files = {};
for (const f of ['index.html', 'app.css', 'app.js', 'logic.js', 'sample-data.js']) files[f] = sha(path.join(ROOT, f));
const src = (existsSync('tests/cases.js') ? readFileSync('tests/cases.js', 'utf8') : '') + (existsSync('tests/logic.test.js') ? readFileSync('tests/logic.test.js', 'utf8') : '');
const cases = (src.match(/\bname\s*:\s*['"`]|\btest\(\s*['"`]/g) || []).length;
const commits = parseInt(spawnSync('git', ['rev-list', '--count', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).stdout?.trim() || '0', 10);
// Every starter commit is written by one address; a learner's commits carry their own. check.js counts the
// learner's commits as the ones NOT by this address, so the Day 2 commit check survives later starter commits.
const starterAuthorEmail = spawnSync('git', ['log', '-1', '--format=%ae'], { cwd: ROOT, encoding: 'utf8' }).stdout?.trim() || null;
writeFileSync(path.join(ROOT, 'quest', 'baseline.json'), JSON.stringify({ files, cases, commits, starterAuthorEmail, madeAt: new Date().toISOString() }, null, 2));
console.log(`baseline written: ${cases} test cases, ${commits} commits, starter author ${starterAuthorEmail}`);
