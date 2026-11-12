# Day 2 — Make it yours

## Today you will
Rename the app, change its three colours, replace the sample tasks with your own real week, and make your first commit and push.

## You will need
- Day 1 done: the app opens in your Codespace and the tests are green.
- 60–90 minutes.
- Your own real week, whatever it is made of: work deadlines, a class or an exam, a client delivery, a training session, a family thing you keep forgetting. You need a name and a date for each. Names and dates only. No marks. No names of people. No roll or employee number. Nothing confidential from an employer or a client.
- Your editor, your terminal and your AI.

**Words used today**
- **Git** (from Day 1): the program in your Codespace that remembers every version of your files. **GitHub**: the website that stores a copy of your project online, under your username.
- **Commit**: a saved snapshot of your project, with a one-line message saying what changed. Git keeps every commit, so you can always go back.
- **Push**: copying your new commits from your Codespace up to GitHub, so the online copy matches.
- **Commit link**: the web address of one commit on GitHub. Anyone who opens it sees exactly which lines you changed. It is how `check.js` and anyone in the shared channel can see what you did.
- **The data file**: `sample-data.js`, a small JavaScript file that holds the list of tasks, one task per line, between a `[` and a `]`. Each task is written with curly brackets, double quotes and commas. A missing comma between two tasks breaks the file; a comma after the last task is allowed.
- **CSS variable**: a named value written once at the top of `app.css` (like `--accent`) and used everywhere else in the file.
- **Badge**: the small label in the task table that shows how many days are left.

## Steps
1. Open your Codespace from github.com (**Code → Codespaces**, click the one listed) and start the app with `npx serve .` as on Day 1, so the preview tab is open next to your files. You should see: the files in the editor and the running app in its preview tab.

2. Rename the app. Open `index.html`. Find the text `Day Planner`. It appears twice: inside `<title>` (the browser tab name) and inside the header `<h1>` (the big title on the page). Change both to a name of your own, for example `My Week` or `Sem 5 Survival Kit`. Save the file and reload the browser. You should see: your new name in the browser tab and at the top of the page.

3. Change the three colours. Open `app.css`. Near the top find the block that starts with `:root {`. Inside it are three lines: `--accent`, `--bg` and `--text`. Change the three values. Colour names work (for example `--accent: teal`, `--bg: ivory`, `--text: navy`) and so do codes like `#1e3a5f`. Keep `--text` dark: the panels stay white. Save and reload with the preview tab's own reload icon. You should see: the page in your colours. If nothing changes, open the app in a normal browser tab (the icon at the top right of the preview) and press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).

4. Look at the data before you change it. Open `sample-data.js` in your editor. It is a list inside a JavaScript file: a line `const sampleTasks = [`, then one task per line, then `];`, then a short block at the bottom that shares the list with the page (leave that block alone). Read one task. You should see: each task has the same seven parts: `id`, `course`, `title`, `type`, `due`, `hours`, `done`, written with curly brackets, double quotes and commas, and a comma at the end of each line except the last. `course` is the area a task belongs to — a job, a client, a class, your own life — which is why the app shows that column as "Course or area".

5. Replace the tasks with your own real week. Delete the twelve sample lines and write 8–12 lines of your own in exactly the same shape: the area each task belongs to in `course` (`Work`, `Freelance`, `DBMS`, `Fitness` — your words), a short task title, a `type` from `exam`, `practical`, `record` or `assignment` (the four buckets are explained at the top of the file; the app only uses them to break a tie when two things fall on the same day), a `due` date written as `YYYY-MM-DD` (for example `2026-11-18`), the `hours` you think it needs (a number, 1 to 6), `done` set to `false`, and an `id` that is a number different for every task (1, 2, 3 ...). Leave the `const sampleTasks = [` line above and the `];` and the sharing block below exactly as they are. With two tasks the middle of the file looks like this:
   ```js
   const sampleTasks = [
     {"id": 1, "course": "Work", "title": "Quarterly report due", "type": "assignment", "due": "2026-11-18", "hours": 4, "done": false},
     {"id": 2, "course": "AI course", "title": "Module 3 quiz", "type": "exam", "due": "2026-11-12", "hours": 2, "done": false}
   ];
   ```
   No marks, no people's names, no roll or employee numbers, nothing confidential from work. Save, reload the app, and if it still shows the old tasks click the **Reset to sample tasks** button at the bottom of the page (it throws away any copy your browser has saved and reads the file again). You should see: your tasks in the table. If the table is empty or the page looks broken, go to "If you are stuck" before doing anything else.

6. Check the data file with a command. Your eyes will miss a comma; the computer will not. This one-line command asks Node to load `sample-data.js` and print how many tasks it found. (`node -e` means "run this small piece of code"; `require('./sample-data.js')` loads the file; `.length` counts the tasks.) In the terminal, inside the project folder (type `dir` or `ls` and check you see `sample-data.js`), paste this as one line and press Enter:
   `node -e "console.log(require('./sample-data.js').length + ' tasks ok')"`
   You should see: `10 tasks ok` (with your own number). If instead you see a red error, read its first lines: they name the file and the line number, with a small `^` under the spot. The mistake is there or on the line just before it (usually a missing comma). Fix it, save, run the command again until it prints the count.

7. Run the tests. `node --test`. You should see: `fail 0`. (The tests use their own built-in data, so they stay green even if your JSON is wrong. That is why Step 6 exists.)

8. Compare the badge with the date. First press **Reset to sample tasks** once more so the page shows the file, not an older saved copy. Pick the task whose due date is nearest. Count the days from today to that date yourself, on a calendar. Look at the task's days-left badge. Then change the "Today" input to the exact due date of any task and look at that task's badge. Write one line in your notes: does the badge agree with the due date? Note anything odd, even if you are not sure. You will need this note on Day 4. You should see: a one-line note. Do not fix anything today.

9. Check Git knows who you are. Every commit carries the name and email of the person who made it. Your Codespace is signed in as you, so this is usually already set: in the terminal run `git config user.email`. You should see: an address printed. If it printed one, skip to Step 10. If it printed nothing, use the private address GitHub gives you (never your real email, GitHub blocks pushes that would publish it): on github.com click your profile picture (top right) → **Settings** → **Emails**, copy the `...@users.noreply.github.com` address shown there, then run `git config --global user.email "that-address"` and `git config --global user.name "Your Name"`. Silence after each command is success.

10. See what changed. Run `git status`. You should see: three file names in red under "Changes not staged for commit": `index.html`, `app.css`, `sample-data.js`.

11. Commit. A commit is a saved snapshot of your project with a message saying what changed. It takes two commands: `git add .` tells Git which files to include (the dot means "everything in this folder"), and `git commit -m "..."` saves the snapshot with your message. Run `git add .`, then `git commit -m "Make it mine: name, colours, my own week"`. You should see: a line like `[main a1b2c3d] Make it mine: name, colours, my own week` followed by `3 files changed`.
    - Buttons instead of typing: click the **Source Control** icon in the left bar of the editor (it shows a number when files have changed). Your changed files are listed. Type the message in the box at the top and click **Commit**.

12. Push. Your commit lives only inside your Codespace so far. `git push` sends it up to your fork on GitHub, so the online copy matches and anyone you give the link to can see it. Run `git push`. Your Codespace is already signed in to GitHub, so it just works. You should see: a few lines ending with something like `main -> main`. Buttons instead: in the **Source Control** panel, click **Sync Changes**.

13. Get the commit link. This is the web address of the commit you just pushed; anyone who opens it sees exactly which lines changed. Open your fork on github.com. Click the "commits" link (near the top of the file list, it shows a count and a clock icon). Click your newest commit. You should see: your changes with removed lines in red and added lines in green, and an address bar that contains `/commit/` followed by a long code. Copy that whole address; it is your commit link.

14. Run your quest log: `node check.js` in the terminal, inside the folder. You should see: Day 1 and Day 2 ticked, level Maker, and a line starting `Day 2` to post. If Day 2 is not ticked, the report says what is missing (title or tasks not changed, colours not changed, or no new commit); fix that one thing and run it again.

## Prompts that help
Prompt 1, checking your data file:
```
Here is a small JavaScript file holding a list of tasks. I replaced the tasks with my own. Check only the syntax: the comma at the end of each line, double quotes, curly brackets, and that every "due" is written YYYY-MM-DD. Tell me the line of each problem and what is wrong there. Do not change my content and do not rewrite the file.

[paste sample-data.js here]
```

Prompt 2, understanding Git:
```
Explain to me, a complete beginner, what git add, git commit and git push each do, one sentence each, using the picture of a laptop and a website. Then explain what this output means, line by line:

[paste what your terminal printed]
```

Prompt 3, understanding the CSS:
```
In this CSS, what is :root and what does var(--accent) do? Explain in plain English in under 100 words. Do not rewrite the file.

[paste the first 20 lines of app.css here]
```

## Submit
- The line `node check.js` printed (your quest log line).
- Your commit link (the address containing `/commit/`).
- Screenshot of the app with your name, your colours and your tasks.
- Your one-line note about the badge.
- Hardest part today: one line.

## Done when
- [ ] The app name and the three colours are changed and visible.
- [ ] `sample-data.js` holds your own real week: 8–12 tasks, names and dates only, no personal details.
- [ ] The check command prints `N tasks ok` and `node --test` prints `fail 0`.
- [ ] `node check.js` shows Day 2 ticked.
- [ ] Your commit is on GitHub and the link is posted.
- [ ] Your badge note is posted.
- [ ] Evidence line posted in the shared channel. Nothing to wait for: `check.js` decided the day.

## If you are stuck
1. The page is blank, or the table is empty, after you edited the data file: the file is broken. Run the check command in Step 6 and fix the line it points at. The usual causes are a missing comma between two tasks, a missing double quote, a deleted `];`, or a date written like `5/11/2026`.
2. The page still shows the OLD sample tasks after your edit: your browser kept a saved copy of the tasks (the app remembers tasks you add through the form). Click **Reset to sample tasks** at the bottom of the page. If that button is not there, open the app in a normal browser tab (the icon at the top right of the preview), press F12, click the **Console** tab, type `localStorage.removeItem('day-planner-tasks')`, press Enter, and reload.
3. `git push` is rejected with a message about a private email address (it mentions `GH007`): Git used your real email and GitHub keeps it private. Run `git config --global user.email "the ...@users.noreply.github.com address from Settings → Emails"`, then `git commit --amend --reset-author --no-edit`, then `git push` again.
4. `git push` is rejected for permission: check the address bar says your own username, not `Beagle-AI-automation`. If you opened the Codespace on the original repo instead of your fork, you have no permission to push to it. Fork first, then open a Codespace on the fork.

## Common mistakes
- Changing colours somewhere in the middle of `app.css` instead of the three variables in `:root` at the top. The variables are what the rest of the file reads.
- Dates written as `11-05-2026`, `5 Nov` or `05/11/26`. Only `2026-11-05` works.
- Putting marks, roll or employee numbers, or other people's names into the data. Areas, titles and dates only.
- Committing before saving the file in the editor. Save, then `git status` to confirm the file is listed, then commit.
- A commit message like `update` or `changes`. Say what changed; your future self reads these.
- Giving two tasks the same `id`. Every task needs its own number.
- Deleting the `const sampleTasks = [` line, the `];`, or the sharing block at the bottom of the file. Only the task lines change.
