// tests/logic.test.js — runs the shared test cases with Node's built-in test runner.
//
// From the starter-app folder:   node --test
// Needs Node 22 or newer. The cases themselves live in tests/cases.js.

import { test } from 'node:test';
import { cases } from './cases.js';

// Dates depend on the laptop's time zone. The tests pin one zone (India time, where
// this course was written) so they give the same answers on every laptop, anywhere.
process.env.TZ = 'Asia/Kolkata';

for (const testCase of cases) {
  test(testCase.name, testCase.run);
}
