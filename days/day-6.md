# Day 6 — Put it online

## Today you will
Publish your planner with GitHub Pages, open it on a phone, and confirm the repo holds no personal data.

## You will need
- Day 5 done and pushed. Tests green.
- 45–75 minutes.
- A phone with a browser.
- Your editor, terminal and AI.

**Words used today**
- **GitHub Pages**: a free GitHub feature that serves the files in a repo as a public website. No server to set up.
- **Deploy**: copy the app to a place where other people can open it.
- **URL**: a web address. Yours will be `https://YOUR-USERNAME.github.io/day-planner-starter/`.
- **Branch**: a named line of commits. You have been working on the one called `main`.
- **Cache**: a saved copy a browser or server keeps to be faster. It can show you an old version for a minute or two.
- **localStorage** (from Day 3): a small storage area inside one browser on one device. Tasks added on your phone are saved on that phone only; the laptop never sees them. The committed `sample-data.js` is what every visitor sees first.
- **Personal data**, for today's check: phone numbers, email addresses, marks or grades, roll numbers, college or employee ID numbers, home addresses, client or employer details that are not yours to publish, and the names of classmates, colleagues, teachers or anyone else. Your own GitHub username and your own area and task names are fine.
- **Root of the repo**: the top folder, the one that directly contains `index.html`. GitHub shows it as `/ (root)`.
- **Quest log** (from Day 1): `node check.js` prints which days are done and one line to post. Today it takes your live address too: `node check.js --url ...`.

## Steps
1. Last local check. Run `node --test`, then `git status`, then `git push`. You should see: `fail 0`; `nothing to commit, working tree clean`; and `Everything up-to-date`. If `git status` lists files, commit them first.

2. Personal-data check, using the list in the word list. Open `sample-data.js` and read every task: area names, titles, types, dates and hours only. Open `index.html` and read the title. Run `git log --oneline` in the terminal and read every commit message it prints. Then search every file for four things: `@` (finds any email address), your phone number, the words `marks` and `roll`, and the names of any classmate or teacher. In VS Code or Cursor press Ctrl+Shift+F (Cmd+Shift+F on Mac) to search the whole folder at once; in Notepad or TextEdit open each file in turn (`index.html`, `app.css`, `app.js`, `logic.js`, `sample-data.js`, `README.md`, `tests/cases.js`) and use Ctrl+F (Cmd+F): a small find box opens; type the word, press Enter, and the editor jumps to it or says it was not found. You should see: nothing personal. If you find something, remove it, commit with a message like `Remove personal detail`, and push. If the thing you found is a password or a key, message Adi directly about it as well, not in the shared channel: it stays in the history and has to be changed at the website that issued it.

3. Turn on Pages. First double-click `explainers/laptop-to-internet.html` and spend three minutes with it: it shows the path your files take from your laptop to GitHub to a visitor's phone, which is what you are about to switch on. Then on github.com open your fork. Click the **Settings** tab (top of the page, to the right of Code, Issues and so on). In the left-hand menu click **Pages**. The page has a heading "Build and deployment". Under it is a dropdown labelled **Source**: choose **Deploy from a branch**. That tells GitHub: take the files exactly as they are on one branch and serve them as a website; no build step, no server of your own. Two more dropdowns appear side by side: in the first choose `main` (the branch, the line of commits you have been working on); in the second, which starts as `None`, choose `/ (root)` (the top folder of the repo, where `index.html` is, so the site starts at your page). Click **Save**. You should see: a message that the Pages source was saved. Wait one to three minutes and refresh the page. You should see: a box saying "Your site is live at https://YOUR-USERNAME.github.io/day-planner-starter/". If no box appears after three minutes, go straight to hint 1 under "If you are stuck"; that is the normal first-time wobble, not something you broke.

4. Open the URL on your laptop. You should see: your planner with your tasks and your colours. The tasks come from the committed `sample-data.js`, the same file double-click uses, so the live site shows exactly what you pushed.

5. Open it on your phone. Type the URL into the phone's browser, or send the link to yourself. You should see: the planner on the phone, readable without zooming, the table and both panels visible, the badges right. Take a screenshot on the phone.

6. Use it once as a user on the phone, with the app's own controls: change the "Today" date box, tick one task's Done checkbox (the one you built on Day 3), and add a task with the form at the bottom. You should see: everything works. The task you added exists only on that phone, because localStorage belongs to each browser separately. That is expected.

7. Put the link where people can find it. In your repo's `README.md` add one line near the top: `Live: https://YOUR-USERNAME.github.io/day-planner-starter/`. Commit (`git commit -am "Add live link"`) and push. You should see: the link on your repo's front page on github.com.

8. Run your quest log with your live address: `node check.js --url https://YOUR-USERNAME.github.io/day-planner-starter/` (your own username and repo name). It fetches your live page once and checks that it answers and carries your title. You should see: Day 6 ticked, level Shipper, and a line starting `Day 6` that ends with `live 200`. If it says the tree is not clean, commit and push first; if it says the page did not answer, wait three minutes and run it again.

## Prompts that help
Prompt 1, understanding Pages:
```
Explain GitHub Pages to a beginner in under 150 words: what it does, why "Deploy from a branch" is enough for a site that is only HTML, CSS and JavaScript files, and why the site takes a minute or two to update after a push.
```

Prompt 2, when the site does not load:
```
My GitHub Pages site shows [404 / a blank page / no tasks]. Here is my repo's file list and my Pages settings. Give me the three most likely causes in order, and for each one, exactly how to check it. Do not guess at changes to my code.

[paste the file list and a description of the Pages settings page here]
```

Prompt 3, the data check:
```
Here is my sample-data.js. Flag anything that could be personal data of a real person, or anything that is not an area name, task title, type, date, hours, id or done flag. Only flag; do not edit.

[paste sample-data.js here]
```

## Submit
- The line `node check.js --url ...` printed (it should end with `live 200`).
- The live URL.
- Screenshot from your phone showing the planner.
- One line: `No personal data: checked data file, title, commit messages, full-folder search.`
- Hardest part today: one line.

## Done when
- [ ] Settings → Pages shows the site is live.
- [ ] The URL opens on your laptop and on your phone with your tasks.
- [ ] The repo contains no personal data (data file, title, commit messages and a full-folder search checked).
- [ ] The live link is in your README.
- [ ] `node check.js --url ...` shows Day 6 ticked with `live 200`.
- [ ] Evidence line posted in the shared channel. Nothing to wait for: `check.js` decided the day.

## If you are stuck
1. The URL gives 404 (page not found). Wait three minutes and refresh. Then check Settings → Pages again: the branch must be `main` and the folder `/ (root)`, and the box must say "live". If it says nothing is happening, open the **Actions** tab; if it says workflows are disabled on this fork, click the button to enable them, then go back to Settings → Pages and click Save once more.
2. The page loads but looks wrong or the table is empty. Check Settings → Pages shows branch `main` and folder `/ (root)`, wait three minutes, then hard-reload (Ctrl+Shift+R). If it is still wrong, open the live URL on your laptop, press F12 → Console, and read the first red line. If it names `sample-data.js`, your last push broke the data file: run the Day 2 check command, fix, commit, push, wait, reload.
3. The phone shows an older version than your laptop. That is the cache. Open the URL in a private tab on the phone, or add `?v=2` to the end of the URL, or wait a few minutes.

## Common mistakes
- Choosing "GitHub Actions" as the source instead of "Deploy from a branch".
- Picking the `docs` folder instead of `/ (root)`. The app files are at the top of the repo.
- Pushing the Day 5 test data (`next-monday`, or an emptied list) by accident. Step 1 catches this if you read `git status`.
- Writing your phone number or email in the README as a contact line. Not in this repo.
- Expecting a task added on the phone to appear on the laptop. localStorage is per browser; the committed JSON is what everyone sees.
