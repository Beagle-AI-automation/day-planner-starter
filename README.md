# Day Planner

A small web app for one problem most people have: a pile of things with dates on them — work, study, side projects, training, family — and no idea which one to start today. You give it your own dated tasks, it answers **"what should I do today?"**

This copy is yours. Rename it, recolour it, put your own real week in, and change how it thinks. It is plain HTML, CSS and JavaScript: no frameworks, no build step, no accounts, no network. Nothing you type leaves your computer.

## Start here (the 7-day build week)

**Go to `days/day-1.md` and start at Step 1.** It tells you everything, one step at a time.

This repo is your copy for the Beagle build week. You install nothing: the whole week runs in a browser tab, inside a GitHub Codespace (a computer GitHub runs for you in the cloud, with a code editor in your browser).

- **What you need:** any computer with a browser (Windows, Mac, Linux, a Chromebook, a borrowed laptop); a free GitHub account; about 8–10 hours this week; the free tier of any AI tool (ChatGPT, Claude, Gemini, Cursor or Copilot). No downloads, no framework, no server: plain HTML, CSS and JavaScript.
- **The week, day by day:** `days/README.md` is the week at a glance, then `days/day-1.md` to `days/day-7.md`. One day at a time, in order.
- **See how it works:** the `explainers/` folder has interactive figures that explain what you meet each day. With the app running (`npx serve .`), add `/explainers/` to the end of the app's address to open them.
- **How review works:** `check.js` verifies the work automatically. Days 1 to 6 are marked done or not done by `node check.js` in your own copy, so there is no human gate and nothing to wait for: run it and you know where you stand. You still post your evidence in the shared channel (the cohort WhatsApp group) — a commit link, a screenshot, three sentences in your own words — because that is how everyone else learns from it. Questions go in that same channel: your own AI tool first, then the channel, then a written answer from Adi within one business day, visible to everyone. There are no one-to-one calls on weekdays. Day 7 is the one day `check.js` cannot score, so you score it yourself against the rubric in `days/day-7.md`. There are no grades and no scores.
- **Your AI is welcome.** Use it for everything. What you must be able to do is explain your change in your own words when asked; if you cannot, you get one question and a chance to rewrite, not a penalty.
- **Your work is yours.** This starter is MIT-licensed (see `LICENSE`), so your fork is yours to keep and change. The week does not promise a job, a placement or an income; it gives you a working app in your own GitHub and the ability to explain it.

## Open it

In your Codespace, in the terminal at the bottom of the editor, run `npx serve .` (say `y` if it asks to install). A tab named **Your app** opens inside the editor with the page in it; the small icon at its top right opens the same page in a normal browser tab. Tasks you add through the form are saved in your browser; "Reset to sample tasks" brings back the list in `sample-data.js`.

## Run the tests

The tests check the thinking in `logic.js`. Run them either way:

- **In the terminal:** `node --test`. Every line should start with a tick and the summary should say `fail 0`. (Node 22 or newer; your Codespace already has it.)
- **In a browser:** with the app running, add `/tests/browser.html` to the end of the app's address. It shows the same test names with PASS or FAIL.

Both run the identical list of tests from `tests/cases.js`.

## Check your progress (the quest log)

From this folder run:

```
node check.js
```

It reads your repo and prints which day's quest is done, your level and XP, what to do next, and one line to post in the shared channel. It is the gate: when it ticks a day, that day is done. It changes nothing and sends nothing. After Day 6 add your live address: `node check.js --url https://<you>.github.io/<repo>/`.

## File map

| File | What it is |
|---|---|
| `index.html` | The page: title, Today and Hours inputs, task table, Today's plan, Clashes, Add task form. Also holds a copy of the sample tasks (see below). |
| `app.css` | The look. Three colour variables at the top control the whole app. |
| `logic.js` | The brain. Six pure functions that sort, plan and count. No page, no clock. |
| `app.js` | The wiring. Reads the inputs, calls `logic.js`, draws the results, saves tasks you add. |
| `sample-data.js` | Twelve made-up tasks across six areas: work, freelance, a course, fitness, family, a job hunt. The only copy; edit this on Day 2. |
| `tests/cases.js` | The list of test cases, shared by Node and the browser. |
| `tests/logic.test.js` | Runs the cases with `node --test`. |
| `tests/browser.html` | Runs the same cases in a browser, no install needed. |
| `check.js` | Your quest log: tells you which day is done and what to do next. |
| `quest/baseline.json` | What the untouched starter looked like; `check.js` compares against it. Do not edit. |
| `README.md` | This file. |

## What logic.js gives you

| Function | What it answers |
|---|---|
| `daysUntil(dueISO, today)` | How many calendar days from `today` to a `'YYYY-MM-DD'` date. 0 = due today, negative = overdue, `NaN` if the date cannot be read. |
| `taskWeight(type)` | How heavy a task type is: exam 4, practical 3, record 2, assignment (or anything else) 1. |
| `prioritise(tasks, today)` | A new array in the order to tackle tasks: overdue first, then soonest due, then heavier type, then title A–Z. |
| `findClashes(tasks)` | Pairs of exams on the same day. |
| `planToday(tasks, today, hoursAvailable)` | `{ chosen, deferred }` — what fits in today's hours, in priority order. Overdue tasks are always chosen. |
| `summarise(tasks, today)` | `{ total, overdue, dueThisWeek }` for the line at the top of the page. |

In the browser these live on `window.planner`; in a test you `import` them from `logic.js`.

## Where to change what

| I want to… | Change this |
|---|---|
| Rename the app | The `<h1>` and `<title>` in `index.html` |
| Change the colours | The three `--accent`, `--bg`, `--text` lines at the top of `app.css` |
| Put my own week in | `sample-data.js` (same shape, one task per line) |
| Change how tasks are ranked | `taskWeight` and `prioritise` in `logic.js` |
| Change what counts as "this week" | `summarise` in `logic.js` |
| Add a test | Add a `{ name, run }` object to the list in `tests/cases.js`; both runners pick it up |
| Change the words in the days-left badge | `describeDaysLeft` in `app.js` |

A task looks like this everywhere:

```json
{ "id": 13, "course": "DBMS", "title": "Assignment 3", "type": "assignment", "due": "2026-11-20", "hours": 2, "done": false }
```

`type` is one of `exam`, `practical`, `record`, `assignment`.

## Good to know

- **Tasks you add are saved in your browser** (under the key `day-planner-tasks`), so they are still there after a reload. They are only in that browser on that computer. **Reset to sample tasks** clears them and loads the sample list again.
- **One copy of the sample tasks.** They live in `sample-data.js`, loaded by `index.html` like any other script, so the Codespace preview, `npx serve` and GitHub Pages all show the same list. Check your edits with `node -e "console.log(require('./sample-data.js').length + ' tasks ok')"`.
- **If you edited the sample tasks and nothing changed**, you are probably looking at tasks saved earlier. Press **Reset to sample tasks**.
- All names and dates in the sample data are made up. Keep it that way when you share your copy: course names and dates only, no marks, no personal details.

## Later, on your own laptop

Nothing in the week needs this. If you ever want the app on your own machine: install Git and Node (22 or newer), `git clone` your fork, and either double-click `index.html` or run `npx serve` in the folder. `node --test` and `node check.js` work the same there.
