# Day 5 — Make it robust

## Today you will
Make the app survive two things real users do, entering a date that is not a date and having no tasks at all, and add tests for both.

## You will need
- Day 4 done and pushed (the `daysUntil` fix).
- 60–90 minutes.
- Your editor, terminal and AI.

**Words used today**
- **Robust**: keeps working, or fails politely with a clear message, when the input is wrong.
- **NaN**: "Not a Number", the value JavaScript gives when a calculation fails. `Number.isNaN(x)` is how you check for it. `x === NaN` is always false, even when `x` is NaN.
- **Empty state**: what a page shows when there is nothing to show. A blank table is a bad empty state; a sentence telling the user what to do is a good one.
- **Guard**: a check at the top of some code that handles the bad case first, so the normal code below can assume the input is fine.
- **Red and green** (from Day 3): a failing test is red, a passing one is green. In the terminal, a red test shows a cross and its name under the failures; the summary line shows `fail` with a number above 0.
- **Render function**: the function in `app.js` that draws the table and the panels from the task list. Search `app.js` for `render` or for `<tr` to find it.
- **From Day 3**: `assertEqual(actual, expected)` fails a test unless the two values are the same; `day('2026-11-05')` makes a "today" for a test; `task({...})` makes a task with sensible defaults.
- **state** and **page**: `state` is the object near the top of `app.js` that holds everything the page knows; `state.tasks` is the task list. `page` holds the parts of the page the code draws into; `page.taskRows` is the body of the table.

## Steps
1. Run the tests before you change anything. `node --test`. You should see: `fail 0`.

2. Reproduce the bad date. In `sample-data.js`, change the `due` of one task to `"next-monday"`. Save, reload the app and click **Reset to sample tasks** so the page reads the file. You should see: something wrong. Usually `NaN` in that task's badge, or the task sorted strangely, or an error in the Console (F12). Screenshot it.

3. Write the tests. First read the ones the starter already has for today's topics: `daysUntil: returns NaN for a date it cannot read`, `planToday: no tasks gives two empty lists` and `summarise: an empty list gives all zeros`. They show that `logic.js` already survives an empty list; the empty state you add later is a page change. Now add four new tests about bad dates, in the same shape as your Day 3 and Day 4 tests: `daysUntil: returns NaN for an empty string` (`assertEqual(Number.isNaN(daysUntil('', day('2026-11-05'))), true)`), `daysUntil: returns NaN for a date written day/month/year` (the string `'31/12/2026'`), `summarise: a task with a bad date is not counted as overdue or due this week` (one task with `due: 'next-monday'`; expect `total` 1, `overdue` 0, `dueThisWeek` 0), and `prioritise: a task with a bad date is kept, not dropped` (one good task and one bad one; the result still has two ids). Run `node --test`. You should see: which of the four are red and which are already green. Some may already pass, because `logic.js` already handles these cases and the broken part is the page. Write down which. Keep the green ones too; they guard behaviour you are about to rely on.

4. Fix the badge. In `app.js`, find `describeDaysLeft(days)`: it turns the number from `daysUntil` into the badge words. Add a guard as its first line: if `Number.isNaN(days)`, return `'check the date'`. Reload with the broken task still in your data (Reset to sample tasks again). You should see: the broken task shows `check the date`, every other task shows its normal badge, the plan panel still renders, and the Console shows no error.

5. Protect the "Add task" form. The due-date box in `index.html` is `type="date"` and `required`, so the browser itself refuses an empty date (try it: leave the date empty, click Add, and the browser shows its own "fill in this field" bubble). Add a second line of defence for a value the browser lets through: in `app.js` find the `submit` listener on `page.addForm`; before the task is pushed, compute `const days = planner.daysUntil(form.get('due'), state.today);` and if `Number.isNaN(days)`, show `check the date` next to the form and `return` so nothing is added. The simplest way to show it: add an empty `<p id="form-note"></p>` just under the Add task button in `index.html`, and in `app.js` set `document.getElementById('form-note').textContent = 'check the date'` (and set it back to `''` when a task is added). To see it work once, temporarily change the due box in `index.html` from `type="date"` to `type="text"`, type `next monday`, click Add, then change it back to `type="date"`. You should see: no crash, no half-added task, and the message next to the form.

6. Put your real data back: `git restore sample-data.js` (and `git restore index.html` if you changed the due box). Reload and click Reset to sample tasks. You should see: your real tasks, with their normal badges, and no `check the date` anywhere.

7. Reproduce the empty list. Temporarily delete every task line in `sample-data.js` so the list reads `const sampleTasks = [` on one line and `];` on the next (keep everything above and below), save, reload, click Reset to sample tasks. You should see: either an empty table and empty panels with nothing explaining why, or an error in the Console. Screenshot it.

8. Add the empty state. In `app.js`, at the top of `renderTable`, if `state.tasks.length === 0`, put one row in the table with the sentence `No tasks yet. Add your first one below.` and return (make the row with the file's `element` helper: `element('tr')` for the row, `element('td', 'No tasks yet. Add your first one below.')` for the cell, set the cell's `colSpan` to the number of columns, append the cell to the row and the row to `page.taskRows`); and at the top of `renderPlan`, if there are no tasks, show `Nothing planned. Add a task to get started.` and return. Reload. You should see: the friendly messages and no error.

9. Put your data back again: `git restore sample-data.js`, reload, Reset to sample tasks. You should see: your tasks, and none of the messages.

10. Run the tests, then commit and push. `node --test`, then `git status` to confirm `sample-data.js` and `index.html` are not listed as changed, then `git add .`, `git commit -m "Handle bad dates and empty task list, with tests"`, `git push`. You should see: `fail 0`, and a commit on GitHub touching `app.js`, `tests/cases.js` and possibly `app.css`, but not `sample-data.js`.

11. Run your quest log: `node check.js`. You should see: Day 5 ticked, level Tester, and a line starting `Day 5` to post. It checks that bad dates give NaN, that an empty list does not break the logic, that the page contains an empty-state sentence and the words `check the date`, and that your tests grew again.

## Prompts that help
Prompt 1, detecting NaN:
```
Here is the part of my app.js that builds the days-left badge. The value can be NaN. Explain how to detect NaN in JavaScript and why x === NaN does not work. Then tell me where in this code the check belongs. Do not rewrite my code; I will.

[paste the 10 to 15 lines around the badge here]
```

Prompt 2, placing the empty state:
```
Here is the render function from my app.js. Where is the right place to check for an empty task list and show a message instead of the table? Give me two options with one trade-off each. I will choose and write it.

[paste the render function here]
```

Prompt 3, reviewing the tests:
```
Review my four new tests. Does each one check exactly one thing? Is any of them impossible to fail? Does any of them depend on today's real date? Explain; do not rewrite them.

[paste your new tests here]
```

## Submit
- The line `node check.js` printed (your quest log line).
- Commit link.
- Test output showing `fail 0`, and a note of which of the four tests were red before your change.
- Screenshot of a task with `check the date` as its badge.
- Screenshot of the empty state.
- Hardest part today: one line.

## Done when
- [ ] Four new tests in `tests/cases.js`; `node --test` prints `fail 0`.
- [ ] A task with a bad date shows `check the date` and the rest of the page still works.
- [ ] Submitting "Add task" with an empty or bad date does not crash and shows a message.
- [ ] An empty task list shows a friendly sentence in the table area and the plan panel.
- [ ] `sample-data.js` is back to your real tasks and was not changed in the commit.
- [ ] `node check.js` shows Day 5 ticked.
- [ ] Evidence line posted in the shared channel. Nothing to wait for: `check.js` decided the day.

## If you are stuck
1. The bad-date task breaks the whole page and nothing renders: one error inside the row-building code stops the entire render. Open F12 → Console; the first red line names the file and line number. Guard the badge line first; everything else depends on it.
2. Your NaN check never triggers: you wrote `=== NaN`. Use `Number.isNaN(value)`.
3. The empty state never shows: the check is in the wrong place or the list is not actually empty (old saved tasks). Click Reset to sample tasks first. Then put the check at the very top of `renderTable`: if `state.tasks.length === 0`, write the message and return before building any rows.

## Common mistakes
- Committing the broken date or the emptied list in `sample-data.js`, or the `type="text"` change in `index.html`. Run `git status` and `git diff` before every commit today.
- Hiding the bad task instead of labelling it. The user needs to see which task to fix.
- Tests that cannot fail, for example checking that `true` is `true`. Every test must call a function from `logic.js` with a real input.
- Making `daysUntil` throw an error for bad input instead of returning `NaN`. The rule is: logic returns `NaN`, the page decides what to show.
- Using today's real date inside a test. Tests must give a fixed `today` so they pass on any day.
