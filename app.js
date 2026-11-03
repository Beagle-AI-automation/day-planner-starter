// app.js — connects the page to logic.js.
//
// This file does three things only: read the inputs, call the functions in
// logic.js, and draw the results on the page. All the thinking (sorting,
// planning, counting) lives in logic.js, which is why logic.js has the tests.

// The six functions from logic.js. Always called as planner.something(...).
const planner = window.planner;

// Tasks you add are kept in the browser under this key, so they survive a reload.
const STORAGE_KEY = 'day-planner-tasks';
const SAVED_NOTE = 'Showing tasks saved in this browser. "Reset to sample tasks" brings the sample list back.';

// Everything the page knows, in one place.
const state = {
  tasks: [],
  today: new Date(),
  hoursAvailable: 3,
  source: '', // one line under the table saying where the tasks came from
};

// The parts of the page we read from or draw into.
const page = {
  todayInput: document.getElementById('today'),
  hoursInput: document.getElementById('hours'),
  summary: document.getElementById('summary'),
  taskRows: document.getElementById('task-rows'),
  sourceNote: document.getElementById('source-note'),
  planList: document.getElementById('plan-list'),
  planHours: document.getElementById('plan-hours'),
  laterList: document.getElementById('later-list'),
  clashList: document.getElementById('clash-list'),
  addForm: document.getElementById('add-task-form'),
  resetButton: document.getElementById('reset-button'),
};

// ---------------------------------------------------------------------------
// Loading and saving

// Tasks saved earlier in this browser, or null if there are none.
function loadSavedTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : null;
  } catch (error) {
    return null; // no storage (private window, strict settings) — fine, we start fresh
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  } catch (error) {
    // Storage is not available. The app still works; the list just will not survive a reload.
  }
}

function clearSavedTasks() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // nothing to clear
  }
}

// The sample tasks come from sample-data.js, which index.html loads before this file.
// We copy each task so that ticking or editing one never changes the original list.
function loadSampleTasks() {
  state.source = '';
  return window.sampleTasks.map((task) => ({ ...task }));
}

// ---------------------------------------------------------------------------
// Drawing

// 'YYYY-MM-DD' for a Date, in local time (the format the date input wants).
function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
}

// The words in the days-left badge.
function describeDaysLeft(days) {
  if (days < 0) return `Overdue by ${-days} ${days === -1 ? 'day' : 'days'}`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days left`;
}

function badgeClass(days) {
  if (days < 0) return 'badge overdue';
  if (days <= 6) return 'badge soon';
  return 'badge';
}

// Makes an element with some text. Using textContent (not innerHTML) means a task
// title like "<b>" is shown exactly as typed, never run as HTML.
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function describeTask(task) {
  return `${task.title} — ${task.course}, ${task.hours}h`;
}

function renderSummary() {
  const summary = planner.summarise(state.tasks, state.today);
  page.summary.textContent = `${summary.total} tasks · ${summary.overdue} overdue · ${summary.dueThisWeek} due this week`;
}

function renderTable() {
  page.taskRows.replaceChildren();
  for (const task of planner.prioritise(state.tasks, state.today)) {
    const days = planner.daysUntil(task.due, state.today);
    const row = element('tr');
    row.append(element('td', task.course), element('td', task.title), element('td', task.type), element('td', task.due, 'date'));
    const badgeCell = element('td');
    badgeCell.append(element('span', describeDaysLeft(days), badgeClass(days)));
    row.append(badgeCell);
    page.taskRows.append(row);
  }
  page.sourceNote.textContent = state.source;
}

function renderPlan() {
  const plan = planner.planToday(state.tasks, state.today, state.hoursAvailable);

  page.planList.replaceChildren(...plan.chosen.map((task) => element('li', describeTask(task))));
  if (plan.chosen.length === 0) page.planList.append(element('li', 'Nothing chosen for today.', 'muted'));

  const plannedHours = plan.chosen.reduce((sum, task) => sum + task.hours, 0);
  page.planHours.textContent = `${plannedHours} of ${state.hoursAvailable} hours planned`;

  page.laterList.replaceChildren(...plan.deferred.map((task) => element('li', describeTask(task))));
  if (plan.deferred.length === 0) page.laterList.append(element('li', 'Nothing left over.', 'muted'));
}

function renderClashes() {
  const clashes = planner.findClashes(state.tasks);
  page.clashList.replaceChildren(
    ...clashes.map(([a, b]) => element('li', `${a.due}: ${a.title} (${a.course}) and ${b.title} (${b.course})`)),
  );
  if (clashes.length === 0) page.clashList.append(element('li', 'No clashes: nothing high-stakes lands on the same day.', 'muted'));
}

// Draw everything again from the current state. Called after every change.
function render() {
  renderSummary();
  renderTable();
  renderPlan();
  renderClashes();
}

// ---------------------------------------------------------------------------
// Inputs

page.todayInput.addEventListener('input', () => {
  const value = page.todayInput.value; // 'YYYY-MM-DD', or '' while the field is being edited
  // Noon, so the day is right in every timezone.
  state.today = value ? new Date(value + 'T12:00:00') : new Date();
  render();
});

page.hoursInput.addEventListener('input', () => {
  state.hoursAvailable = Number(page.hoursInput.value) || 0;
  render();
});

page.addForm.addEventListener('submit', (event) => {
  event.preventDefault(); // stay on the page instead of reloading it
  const form = new FormData(page.addForm);
  state.tasks.push({
    id: nextId(),
    course: form.get('course').trim(),
    title: form.get('title').trim(),
    type: form.get('type'),
    due: form.get('due'),
    hours: Number(form.get('hours')),
    done: false,
  });
  saveTasks();
  state.source = SAVED_NOTE;
  page.addForm.reset();
  render();
});

page.resetButton.addEventListener('click', () => {
  clearSavedTasks();
  state.tasks = loadSampleTasks();
  render();
});

// One more than the biggest numeric id so far (ids in sample-data.js are 1, 2, 3 ...).
function nextId() {
  const numbers = state.tasks.map((task) => Number(task.id)).filter(Number.isFinite);
  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

// ---------------------------------------------------------------------------
// Start

async function start() {
  page.todayInput.value = toISODate(state.today);
  page.hoursInput.value = String(state.hoursAvailable);

  const saved = loadSavedTasks();
  if (saved) {
    state.tasks = saved;
    state.source = SAVED_NOTE;
  } else {
    state.tasks = loadSampleTasks();
  }
  render();
}

start();
