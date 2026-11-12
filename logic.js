// logic.js — the planner's brain.
//
// Every function here is PURE: values go in, a value comes out. Nothing in this
// file touches the page (no document, no window.*) and nothing reads the clock
// (no Date.now(), no new Date() without arguments). "Today" is always passed in,
// which is what makes these functions easy to test.
//
// A task looks like this:
//   { id, course, title, type, due: 'YYYY-MM-DD', hours: number, done: false }
// where type is one of 'exam', 'practical', 'record', 'assignment'.

// Whole calendar days from `today` (a Date) to `dueISO` (a 'YYYY-MM-DD' string).
// 0 means due today, a negative number means overdue.
// Returns NaN when dueISO is not a date it can read.
function daysUntil(dueISO, today) {
  return Math.floor((new Date(dueISO) - today) / 86400000); // 86400000 ms = one day
}

// How much a task "weighs" when two tasks are due on the same day: heavier first.
function taskWeight(type) {
  if (type === 'exam') return 4;
  if (type === 'practical') return 3;
  if (type === 'record') return 2;
  return 1; // 'assignment', and any type we do not know
}

// A NEW array with the tasks in the order you should tackle them:
//   1. overdue tasks first, most overdue at the top
//   2. then by due date, soonest first
//   3. same due date: heavier type first (see taskWeight)
//   4. still tied: title A to Z
// The array you pass in is left exactly as it was.
function prioritise(tasks, today) {
  return tasks.slice().sort(function compare(a, b) {
    const overdueA = daysUntil(a.due, today) < 0;
    const overdueB = daysUntil(b.due, today) < 0;
    if (overdueA !== overdueB) return overdueA ? -1 : 1;
    if (a.due !== b.due) return a.due < b.due ? -1 : 1; // 'YYYY-MM-DD' strings sort like dates
    if (taskWeight(a.type) !== taskWeight(b.type)) return taskWeight(b.type) - taskWeight(a.type);
    return a.title.localeCompare(b.title);
  });
}

// Pairs of exams that fall on the same day, as [taskA, taskB]. Each pair appears once.
function findClashes(tasks) {
  const clashes = [];
  for (let i = 0; i < tasks.length; i += 1) {
    for (let j = i + 1; j < tasks.length; j += 1) {
      const a = tasks[i];
      const b = tasks[j];
      if (a.type === 'exam' && b.type === 'exam' && a.due === b.due) {
        clashes.push([a, b]);
      }
    }
  }
  return clashes;
}

// What to do today. Walks the tasks in prioritise() order and picks each one whose
// hours still fit in the hours left (a task that exactly uses up the remaining
// hours is picked). Overdue tasks are always picked, even when they do not fit.
// Everything that is not picked goes to `deferred`.
function planToday(tasks, today, hoursAvailable) {
  const chosen = [];
  const deferred = [];
  let hoursLeft = hoursAvailable;
  for (const task of prioritise(tasks, today)) {
    const overdue = daysUntil(task.due, today) < 0;
    if (overdue || task.hours <= hoursLeft) {
      chosen.push(task);
      hoursLeft -= task.hours;
    } else {
      deferred.push(task);
    }
  }
  return { chosen, deferred };
}

// Three numbers for the top of the page.
// dueThisWeek counts tasks due today or within the next 6 days.
function summarise(tasks, today) {
  let overdue = 0;
  let dueThisWeek = 0;
  for (const task of tasks) {
    const days = daysUntil(task.due, today);
    if (days < 0) overdue += 1;
    if (days >= 0 && days <= 6) dueThisWeek += 1;
  }
  return { total: tasks.length, overdue, dueThisWeek };
}

// ---------------------------------------------------------------------------
// Sharing these functions with the rest of the project.
// The browser loads this file with a plain <script> tag and finds the functions on
// window.planner. Node (the tests) loads it with `import`, which reads module.exports.
// Keep this block at the bottom, and add any new function to BOTH lists.
if (typeof module !== 'undefined') {
  module.exports = { daysUntil, taskWeight, prioritise, findClashes, planToday, summarise };
} else {
  window.planner = { daysUntil, taskWeight, prioritise, findClashes, planToday, summarise };
}
