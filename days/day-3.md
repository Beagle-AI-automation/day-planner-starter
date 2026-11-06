# Day 3 — Add one feature

## Today you will
Add a "Done" checkbox to every task so that finished work leaves today's plan and the overdue count, stays in the table greyed out, and survives a reload, writing the tests before the code.

## You will need
- Day 2 done and pushed.
- 90–120 minutes.
- Your editor, terminal and AI.

**Words used today**
- **Feature**: a new thing the app can do.
- **Red and green**: a test that fails is "red"; one that passes is "green". We write the test before the code so we see it fail first. A test that was never red proves nothing, because it might pass for the wrong reason.
- **localStorage**: a small storage area inside your browser where a web page can keep data between reloads. The app already uses it when you add a task.
- **Mutate**: to change the thing you were given instead of returning a new one. `prioritise` must not mutate its input.
- **Listener**: code that runs when something happens on the page, such as a checkbox being ticked.
- **Render**: the code that draws the table and panels from the task list.
- **filter**: a built-in list operation that makes a new list keeping only the items a rule says yes to. `numbers.filter(n => n > 2)` keeps the numbers above 2; the rule `n => n > 2` reads "for each number n, keep it when n is above 2". `!x` means "not x". The original list is untouched.
- **Class** (in HTML/CSS): a label you put on an element, such as a table row, so a CSS rule can style every element with that label.
- **Search in a file**: Ctrl+F (Windows) or Cmd+F (Mac) inside your editor finds a word in the open file. Ctrl+Shift+F searches every file in the project.

## Steps
1. Write the rule in words before touching code. In your notes: "A task with `done: true` is not in today's plan and is not counted as overdue or due this week, but is still shown in the table, greyed out, and stays done after a reload." You should see: the rule written down. Your tests are this sentence turned into code.

2. Run the tests before you change anything. `node --test`. You should see: `fail 0`. (Run before you change; now you have a baseline.)

3. Open `explainers/what-a-test-is.html` the way you open every explainer: with the app running, add `explainers/what-a-test-is.html` after the `/` in the preview's address. Spend five minutes with it; it shows what a test is and what red and green mean. Then open `tests/cases.js`. This file holds the list of tests that both `node --test` and `tests/browser.html` run. At the top are small helpers you will use: `assertEqual(actual, expected)` fails the test unless the two are the same; `assertDeepEqual` does the same for lists; `task({...})` makes a task with sensible defaults so you only write the fields that matter; `day('2026-11-05')` makes a "today"; `ids(list)` gives just the ids of a list of tasks. Find an existing test for `summarise` and read it. You should see: each test is an object with a `name` and a `run()` method; `run()` builds a few tasks with `task(...)`, calls one function from `logic.js`, and checks the answer with `assertEqual`.

4. Write three new tests, copying the shape of an existing one. Names, in the file's own style: `prioritise: leaves out done tasks`, `planToday: never chooses a done task`, `summarise: does not count a done task as overdue`. In each, build two or three small tasks where one has `done: true` (an overdue one is a good choice for the third test), call the function, and check that the done task is absent or not counted. "Call the function" means write its name followed by its inputs in round brackets, exactly as the existing tests do: `prioritise(tasks, day('2026-11-05'))` calls `prioritise` with a list of tasks and a date, and what comes back is what you check. The first one looks like this; put it inside the list in `buildCases`, right after the last existing `prioritise` test, with a comma after it:
   ```js
   {
     name: 'prioritise: leaves out done tasks',
     run() {
       const tasks = [
         task({ id: 'a', due: '2026-11-06', done: true }),
         task({ id: 'b', due: '2026-11-07' }),
       ];
       assertDeepEqual(ids(prioritise(tasks, day('2026-11-05'))), ['b']);
     },
   },
   ```
   Write the other two yourself in the same shape (for `planToday`, check that `ids(result.chosen)` and `ids(result.deferred)` both leave out `'a'`; for `summarise`, give the done task a due date before today and check `.overdue` is 0). Run `node --test`. You should see: `fail 3` (or at least `fail 1`), and the names of your tests in the failures. Screenshot this: it is your red evidence.

5. Change `logic.js`. In `prioritise`, before sorting, keep only the tasks that are not done. `filter` is the tool for this (see the word list); ask your AI to show you `filter` on a list of numbers first, then write the one line for tasks yourself. Because `planToday` walks the `prioritise` order, it follows automatically. In `summarise`, skip done tasks when counting `overdue` and `dueThisWeek` (`if (task.done) continue;` as the first line inside the loop: `continue` means skip the rest of this loop turn and go to the next task); keep `total` counting every task, because every task is still in the table. Run `node --test`. You should see: `fail 0`, with your three new tests passing and no old test broken. Screenshot: green evidence. One warning before the next step: reload the app now and you will notice the table is drawn from `prioritise(...)` too, so done tasks would vanish from it. Step 6 fixes that.

6. Add the checkbox to the page. Open `app.js`. Press Ctrl+F (Cmd+F on Mac) and search for `renderTable`. That function loops over `planner.prioritise(state.tasks, state.today)` and builds one row per task with `element('tr')` and `row.append(element('td', ...))` (a `td` is one table cell). Two changes here. First, make the loop cover every task: the open ones in priority order, then the done ones after them. Build the list with `const rows = [...planner.prioritise(state.tasks, state.today), ...state.tasks.filter((t) => t.done)];` and loop over `rows` (the three dots spread one list into another, so this is the open tasks followed by the done ones; `t => t.done` is a tiny rule that reads "for each task t, keep it when its done is true"). Second, add a first cell holding a checkbox: create it with `document.createElement('input')`, set its `type` to `'checkbox'` and its `checked` to `task.done`, put it inside a `td` and add that cell to the row before the others. Third, in `index.html` add an empty `<th></th>` just before `<th>Course or area</th>`, so the column headings still line up with the cells. Reload. You should see: every task back in the table, a checkbox at the start of every row, ticked for done tasks. Ticking does nothing yet.

7. Make the tick work. Add a listener for the checkbox's `change` event: a listener is a function you attach to an element so the browser runs it when something happens, and its shape is `checkbox.addEventListener('change', () => { ...your code... })`. When it fires: find the task in `state.tasks` by its id and set its `done` to the checkbox's `checked` value, call `saveTasks()` (the function `app.js` already uses after "Add task"; it writes the list to localStorage), then call `render()`. Reload and tick a task. You should see: the task disappears from Today's plan, the overdue number goes down if it was overdue, and the row stays in the table.

8. Grey it out. In `renderTable`, after the row is created, add `if (task.done) row.classList.add('done');`. In `app.css` add a rule like `.done { opacity: 0.5; text-decoration: line-through; }`. Reload and tick a task. You should see: the ticked row faded with a line through it.

9. Reload the page. You should see: your ticks still there, because they were saved to localStorage. If they are gone, the save in Step 7 did not happen; see "If you are stuck".

10. Open the browser test runner: with the app running, add `tests/browser.html` after the `/` in the preview's address. You should see: your three new test names listed with PASS, the same list as Node.

11. Commit and push, the same three commands as Day 2: `git add .` then `git commit -m "Add Done checkbox: logic ignores done tasks, tests first"` then `git push`. You should see: the push output, and on GitHub a commit that touches `logic.js`, `app.js`, `app.css`, `index.html` and `tests/cases.js`.

12. Run your quest log: `node check.js`. You should see: Day 3 ticked, level Builder, and a line starting `Day 3` to post. It checks exactly today's rule (a done overdue task is not planned, not counted as overdue or due this week) and that you have more tests than the starter had.

## Prompts that help
Prompt 1, writing a test:
```
Here is the test file from my project. I want to add a test named "prioritise: leaves out done tasks". First show me how one existing test is built (name, run, the tasks it makes, the check it does). Then tell me what my new test needs: which tasks to build, which function to call, what to check. Do not write the test for me. I will write it and paste it back for you to review.

[paste tests/cases.js here]
```

Prompt 2, understanding app.js:
```
Here is app.js from my project. Walk me through what happens from page load to the table being drawn, naming each function in the order it runs. Then tell me where a change would belong if I wanted a checkbox in each row that updates the task's done value, saves, and re-draws. Explain; do not rewrite the file.

[paste app.js here]
```

Prompt 3, reading a red test:
```
My test is failing with this output. Explain what the test expected, what it actually got, and which function in logic.js I would need to change. Do not give me the code. Ask me what I think the change should be.

[paste the test output here]
```

## Submit
- The line `node check.js` printed (your quest log line).
- Screenshot of the red run (`fail 3` or similar) taken before you changed `logic.js`.
- Screenshot of the green run after.
- Commit link. The commit must include the change to `tests/cases.js`.
- Screenshot of the app with one task ticked and greyed, and missing from Today's plan.
- Hardest part today: one line.

## Done when
- [ ] Three or more new tests in `tests/cases.js`, and a screenshot showing them red before the logic change.
- [ ] `node --test` prints `fail 0`; `tests/browser.html` shows the new names with PASS.
- [ ] A ticked task leaves Today's plan and the overdue count, and stays in the table greyed out.
- [ ] Ticks survive a reload.
- [ ] `prioritise` does not change the list it was given (the existing "does not mutate" test still passes).
- [ ] Commit pushed with tests, logic, page and style changes.
- [ ] `node check.js` shows Day 3 ticked.
- [ ] Evidence line posted in the shared channel. Nothing to wait for: `check.js` decided the day.

## If you are stuck
1. Your new test is not red; it passes before you changed `logic.js`. Then it is not checking what you think. Read its check line. A test for done tasks must build at least one task with `done: true` and expect it to be absent from the result (or not counted). If you expect it to be present, you have the check backwards.
2. The tick does nothing. The listener is probably attached to a checkbox that no longer exists, because rows are redrawn on every render. Attach the listener at the moment you build the row, or attach one listener to the whole table and read `event.target`. Put `console.log('ticked', task.id)` inside the listener and watch the Console (F12) to see whether it runs at all.
3. Ticks vanish on reload. Either you did not call `saveTasks()` after changing `done`, or you changed `done` on a copy of the task rather than on the one inside `state.tasks` (find it with `state.tasks.find(t => t.id === task.id)`). Call `saveTasks()` right after you set `done`. Then check, in a normal browser tab (the icon at the top right of the preview): F12 → Application → Local Storage → the key `day-planner-tasks` should contain `"done":true` for the ticked task.

## Common mistakes
- Writing the code first and the tests after. They are green immediately and prove nothing. The red screenshot comes first.
- Leaving `renderTable` looping over `prioritise(...)` only, so done tasks vanish from the table. Only the plan and the counts ignore them; the table shows everything.
- Calling `tasks.sort(...)` directly on the input inside `prioritise`. That changes the caller's list. Sort a copy.
- Adding the test to `tests/logic.test.js` only, so the browser runner never sees it. Add it to `tests/cases.js`, which both runners share.
- Testing in a browser that still holds old saved data. If things look stale, click **Reset to sample tasks** and reload.
