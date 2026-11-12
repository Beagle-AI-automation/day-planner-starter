// tests/cases.js — the list of test cases.
//
// Node (tests/logic.test.js) and the browser (tests/browser.html) both run this
// exact list, so you only ever write a test once. Each case is { name, run }:
// run() throws an Error when something is wrong, and simply returns when all is well.
// One behaviour per test, named in plain words.

// ---- tiny helpers ---------------------------------------------------------

// Fails the test unless `actual` is exactly `expected`.
function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error(`expected ${show(expected)} but got ${show(actual)}`);
  }
}

// Fails the test unless `actual` and `expected` have the same contents (for arrays and objects).
function assertDeepEqual(actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`expected ${show(expected)} but got ${show(actual)}`);
  }
}

function show(value) {
  return Number.isNaN(value) ? 'NaN' : JSON.stringify(value);
}

// A Date for midnight at the start of the given day, in the laptop's own time zone.
// The tests pass this in as "today".
function day(iso) {
  return new Date(iso + 'T00:00:00');
}

// A task for a test. Give only the fields that matter; the rest get defaults.
function task(fields) {
  return { id: 'x', course: 'Work', title: 'Task', type: 'assignment', due: '2026-11-05', hours: 1, done: false, ...fields };
}

// Just the ids, in order — easier to compare than whole task objects.
function ids(tasks) {
  return tasks.map((t) => t.id);
}

// ---- the cases ------------------------------------------------------------

// `planner` is the object of functions from logic.js.
function buildCases(planner) {
  const { daysUntil, taskWeight, prioritise, findClashes, planToday, summarise } = planner;

  return [
    // daysUntil ------------------------------------------------------------
    {
      name: 'daysUntil: a task due tomorrow is 1 day away',
      run() { assertEqual(daysUntil('2026-11-03', day('2026-11-02')), 1); },
    },
    {
      name: 'daysUntil: a task due today is 0 days away',
      run() { assertEqual(daysUntil('2026-11-02', day('2026-11-02')), 0); },
    },
    {
      name: 'daysUntil: a task due yesterday is -1 (overdue)',
      run() { assertEqual(daysUntil('2026-11-01', day('2026-11-02')), -1); },
    },
    {
      name: 'daysUntil: counts correctly across a month boundary',
      run() { assertEqual(daysUntil('2026-12-10', day('2026-11-01')), 39); },
    },
    {
      name: 'daysUntil: returns NaN for a date it cannot read',
      run() { assertEqual(Number.isNaN(daysUntil('next tuesday', day('2026-11-02'))), true); },
    },

    // taskWeight -----------------------------------------------------------
    {
      name: 'taskWeight: an exam weighs 4',
      run() { assertEqual(taskWeight('exam'), 4); },
    },
    {
      name: 'taskWeight: a practical weighs 3',
      run() { assertEqual(taskWeight('practical'), 3); },
    },
    {
      name: 'taskWeight: a record weighs 2',
      run() { assertEqual(taskWeight('record'), 2); },
    },
    {
      name: 'taskWeight: an assignment weighs 1',
      run() { assertEqual(taskWeight('assignment'), 1); },
    },
    {
      name: 'taskWeight: an unknown type weighs 1',
      run() { assertEqual(taskWeight('quiz'), 1); },
    },

    // prioritise -----------------------------------------------------------
    {
      name: 'prioritise: overdue tasks come before everything else',
      run() {
        const tasks = [task({ id: 'later', due: '2026-11-05' }), task({ id: 'overdue', due: '2026-11-01' })];
        assertDeepEqual(ids(prioritise(tasks, day('2026-11-02'))), ['overdue', 'later']);
      },
    },
    {
      name: 'prioritise: the most overdue task comes first',
      run() {
        const tasks = [task({ id: 'one-day', due: '2026-11-01' }), task({ id: 'three-days', due: '2026-10-30' })];
        assertDeepEqual(ids(prioritise(tasks, day('2026-11-02'))), ['three-days', 'one-day']);
      },
    },
    {
      name: 'prioritise: the task due soonest comes first',
      run() {
        const tasks = [task({ id: 'next-week', due: '2026-11-10' }), task({ id: 'soon', due: '2026-11-04' })];
        assertDeepEqual(ids(prioritise(tasks, day('2026-11-02'))), ['soon', 'next-week']);
      },
    },
    {
      name: 'prioritise: on the same due date, the heavier type comes first',
      run() {
        const tasks = [task({ id: 'assignment', type: 'assignment' }), task({ id: 'exam', type: 'exam' })];
        assertDeepEqual(ids(prioritise(tasks, day('2026-11-02'))), ['exam', 'assignment']);
      },
    },
    {
      name: 'prioritise: on the same due date and type, titles go A to Z',
      run() {
        const tasks = [task({ id: 'z', title: 'Zeta' }), task({ id: 'a', title: 'Alpha' })];
        assertDeepEqual(ids(prioritise(tasks, day('2026-11-02'))), ['a', 'z']);
      },
    },
    {
      name: 'prioritise: returns a new array and leaves the original untouched',
      run() {
        const tasks = [task({ id: 'later', due: '2026-11-09' }), task({ id: 'soon', due: '2026-11-03' })];
        const sorted = prioritise(tasks, day('2026-11-02'));
        assertDeepEqual(ids(tasks), ['later', 'soon']);
        assertEqual(sorted === tasks, false);
      },
    },
    {
      name: 'prioritise: an empty list stays empty',
      run() { assertDeepEqual(prioritise([], day('2026-11-02')), []); },
    },

    // findClashes ----------------------------------------------------------
    {
      name: 'findClashes: two exams on the same day are a clash',
      run() {
        const a = task({ id: 'a', type: 'exam', due: '2026-11-24' });
        const b = task({ id: 'b', type: 'exam', due: '2026-11-24' });
        assertDeepEqual(findClashes([a, b]), [[a, b]]);
      },
    },
    {
      name: 'findClashes: exams on different days are not a clash',
      run() {
        const a = task({ id: 'a', type: 'exam', due: '2026-11-24' });
        const b = task({ id: 'b', type: 'exam', due: '2026-11-25' });
        assertDeepEqual(findClashes([a, b]), []);
      },
    },
    {
      name: 'findClashes: an exam and a practical on the same day are not a clash',
      run() {
        const a = task({ id: 'a', type: 'exam', due: '2026-11-24' });
        const b = task({ id: 'b', type: 'practical', due: '2026-11-24' });
        assertDeepEqual(findClashes([a, b]), []);
      },
    },
    {
      name: 'findClashes: a single exam never clashes with itself',
      run() { assertDeepEqual(findClashes([task({ id: 'a', type: 'exam' })]), []); },
    },
    {
      name: 'findClashes: three exams on one day make three pairs, each reported once',
      run() {
        const a = task({ id: 'a', type: 'exam', due: '2026-11-24' });
        const b = task({ id: 'b', type: 'exam', due: '2026-11-24' });
        const c = task({ id: 'c', type: 'exam', due: '2026-11-24' });
        const pairs = findClashes([a, b, c]).map((pair) => ids(pair));
        assertDeepEqual(pairs, [['a', 'b'], ['a', 'c'], ['b', 'c']]);
      },
    },
    {
      name: 'findClashes: no tasks means no clashes',
      run() { assertDeepEqual(findClashes([]), []); },
    },

    // planToday ------------------------------------------------------------
    {
      name: 'planToday: chooses tasks that fit in the hours available',
      run() {
        const tasks = [task({ id: 'a', hours: 2, due: '2026-11-03' }), task({ id: 'b', hours: 1, due: '2026-11-04' })];
        const plan = planToday(tasks, day('2026-11-02'), 3);
        assertDeepEqual(ids(plan.chosen), ['a', 'b']);
        assertDeepEqual(ids(plan.deferred), []);
      },
    },
    {
      name: 'planToday: a task that does not fit is deferred',
      run() {
        const tasks = [task({ id: 'a', hours: 2, due: '2026-11-03' }), task({ id: 'b', hours: 2, due: '2026-11-04' })];
        const plan = planToday(tasks, day('2026-11-02'), 3);
        assertDeepEqual(ids(plan.chosen), ['a']);
        assertDeepEqual(ids(plan.deferred), ['b']);
      },
    },
    {
      name: 'planToday: keeps looking after a task that does not fit, so a smaller one can still be chosen',
      run() {
        const tasks = [
          task({ id: 'a', hours: 2, due: '2026-11-03' }),
          task({ id: 'b', hours: 2, due: '2026-11-04' }),
          task({ id: 'c', hours: 1, due: '2026-11-05' }),
        ];
        const plan = planToday(tasks, day('2026-11-02'), 3);
        assertDeepEqual(ids(plan.chosen), ['a', 'c']);
        assertDeepEqual(ids(plan.deferred), ['b']);
      },
    },
    {
      name: 'planToday: a task that exactly fills the remaining hours is chosen',
      run() {
        const tasks = [task({ id: 'a', hours: 3 })];
        assertDeepEqual(ids(planToday(tasks, day('2026-11-02'), 3).chosen), ['a']);
      },
    },
    {
      name: 'planToday: chooses tasks in priority order',
      run() {
        const tasks = [task({ id: 'later', hours: 1, due: '2026-11-09' }), task({ id: 'soon', hours: 1, due: '2026-11-03' })];
        assertDeepEqual(ids(planToday(tasks, day('2026-11-02'), 5).chosen), ['soon', 'later']);
      },
    },
    {
      name: 'planToday: an overdue task is chosen even when it does not fit',
      run() {
        const tasks = [task({ id: 'overdue', hours: 5, due: '2026-11-01' })];
        const plan = planToday(tasks, day('2026-11-02'), 3);
        assertDeepEqual(ids(plan.chosen), ['overdue']);
        assertDeepEqual(ids(plan.deferred), []);
      },
    },
    {
      name: 'planToday: with zero hours available only overdue tasks are chosen',
      run() {
        const tasks = [task({ id: 'overdue', hours: 1, due: '2026-11-01' }), task({ id: 'soon', hours: 1, due: '2026-11-04' })];
        const plan = planToday(tasks, day('2026-11-02'), 0);
        assertDeepEqual(ids(plan.chosen), ['overdue']);
        assertDeepEqual(ids(plan.deferred), ['soon']);
      },
    },
    {
      name: 'planToday: no tasks gives two empty lists',
      run() { assertDeepEqual(planToday([], day('2026-11-02'), 3), { chosen: [], deferred: [] }); },
    },

    // summarise ------------------------------------------------------------
    {
      name: 'summarise: total counts every task',
      run() {
        const tasks = [task({ due: '2026-11-01' }), task({ due: '2026-11-02' }), task({ due: '2026-12-10' })];
        assertEqual(summarise(tasks, day('2026-11-02')).total, 3);
      },
    },
    {
      name: 'summarise: overdue counts tasks due before today, not tasks due today',
      run() {
        const tasks = [task({ due: '2026-11-01' }), task({ due: '2026-11-02' }), task({ due: '2026-11-03' })];
        assertEqual(summarise(tasks, day('2026-11-02')).overdue, 1);
      },
    },
    {
      name: 'summarise: dueThisWeek counts tasks due today up to 6 days from now',
      run() {
        const tasks = [
          task({ due: '2026-11-01' }), // yesterday: no
          task({ due: '2026-11-02' }), // today: yes
          task({ due: '2026-11-08' }), // 6 days away: yes
          task({ due: '2026-11-09' }), // 7 days away: no
        ];
        assertEqual(summarise(tasks, day('2026-11-02')).dueThisWeek, 2);
      },
    },
    {
      name: 'summarise: an empty list gives all zeros',
      run() { assertDeepEqual(summarise([], day('2026-11-02')), { total: 0, overdue: 0, dueThisWeek: 0 }); },
    },
  ];
}

// ---------------------------------------------------------------------------
// Sharing the list.
// Node (the tests) loads this file with `import`, which reads module.exports.
// The browser (tests/browser.html) loads it with a <script> tag and finds the list on window.cases.
if (typeof module !== 'undefined') {
  const cases = buildCases(require('../logic.js'));
  module.exports = { cases, buildCases };
} else {
  window.cases = buildCases(window.planner);
}
