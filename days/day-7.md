# Day 7 — Ship it

## Today you will
Put the last polish on the app, ship the live site, post the link in the shared channel, and score your own week against the rubric at the bottom of this file.

Nobody marks this day. There is no session, no slot and no verdict to wait for: you finish the week yourself, today, and the rubric tells you what finished looks like.

## You will need
- Days 1–6 done (`node check.js` ticking Day 6 with `live 200`).
- 60–90 minutes.
- Your repo open in the editor, tests green, the live URL open in a browser tab.
- Your AI open in another tab.

**Words used today**
- **Ship**: make the thing other people actually use the current version. For you that is: the live GitHub Pages site shows your latest work, and the link is posted.
- **Rubric**: the written standard for the week. It is at the bottom of this file. You read it, you compare your own work against it, you say which rows you met.
- **Self-score**: your own honest read of your own work, written down. Not a grade. "Not met" on a row is a useful, normal answer and nothing happens to you for writing it.
- **README**: the front page of your repo on github.com. It is what someone sees first.

## Steps
1. Clear the decks. In the terminal, in your folder, run `git status`. You should see: `nothing to commit, working tree clean`. If it lists files, read them. Anything from Day 5's experiments (`scratch.mjs`, a half-finished test, test data in `sample-data.js`) comes out now: `git restore <file>` to throw a change away, or commit it if it belongs. Then `node --test`. You should see: `fail 0`.

2. Last read of your own app. Open the live URL. Click through it the way a stranger would: tick a task, untick it, add a task, reload, look at the badges, make the window narrow. You should see: nothing broken, and a list of at most two or three small things you want to fix. Write them down.

3. Fix at most two of them, and no more. Pick the two that a stranger would notice first. A label that is wrong, a colour that is unreadable, a date that reads badly. If a fix touches `logic.js`, write the test first and watch it go red, the way you did on Days 3, 4 and 5. Run `node --test` green, commit, push. You should see: `fail 0`, and a commit on github.com. Resist the third fix; shipping a clean small thing beats a bigger unfinished one.

4. Write your README. This is the part most people skip and it is the part that is worth something later. Open `README.md` in your editor and make it say, in your own words, in about ten lines: what the app does; the live link; how to run it locally (`git clone`, open `index.html`, `node --test`); what you changed this week; the bug you found on Day 4, its cause in one sentence, and how you know it is fixed; and one thing you would build next. Commit and push. You should see: your fork's front page on github.com showing your own text, with the live link clickable.

   Why it matters: in three months you will not remember Day 4. This paragraph is the only thing that will still explain it, and it is the thing you send someone who asks what you can do.

5. Ship it. Push everything, wait a minute, then hard-reload the live URL (Ctrl+Shift+R, Cmd+Shift+R on Mac). You should see: the live site showing exactly what your laptop shows, including the fixes from step 3.

6. Run your quest log one last time, with your live address: `node check.js --url https://YOUR-USERNAME.github.io/day-planner-starter/`. You should see: Days 1 to 6 ticked, level Shipper, and Day 7 shown as `(you score this one yourself)`. Day 7 stays open in the quest log because a program cannot read a self-score; that is not a missing verdict from anyone.

7. Self-score against the rubric below. Read the seven rows. For each one write `met` or `not met` in one line, in your own words, naming your own evidence ("Day 3 met: three new tests in cases.js, red screenshot from before the change"). Be honest on the rows you did not meet. You should see: seven lines you wrote yourself.

8. Post it in the shared channel, in one message: the live URL, your fork link, your seven self-score lines, one line on what you would build next, and one line on something you still do not fully understand. `node check.js --submit 7` prints the skeleton for you. You should see: your message in the channel, and the end of your trial week.

   The last line matters most. "I still do not really understand how localStorage decides what to keep" is a better end to the week than a clean sheet, and it is the thing worth working on next.

9. Decide what comes next. Nothing is charged, ever, from this week: you never gave a card, and the trial does not roll into anything. You keep the repo, the live site and everything in them, whatever you decide.
   - If you want to keep going with Beagle, the paid options and their prices are on https://learning.beaglecorp.com and defined in full in the trial terms. Say `continue` in the channel and you will be pointed at them; nothing is bought by saying it.
   - `not now` means you stop here and keep everything you built. `undecided` means exactly that.
   - Any of the three is a fine answer, and none of them changes anything about this week. No option promises a job, a placement or an income.

## The rubric
This is the standard for the week, one row per day. Score yourself against it in step 7. "Met" means you can point at the evidence, not that it felt fine.

| Day | Met when you can show |
|---|---|
| 1 | The app open on your laptop with tasks visible; tests green (`fail 0` or all PASS); your fork under your own username; three sentences on `planToday` that name its input (tasks, today, hours), its output (chosen and deferred) and its rule (walk the priority order, add while hours fit, overdue always chosen) — in your words, not a paste |
| 2 | A commit link showing `index.html`, `app.css` and `sample-data.js` changed; the app with your name, your colours and your own real week in it; your data file holding area, title, type, date, hours and nothing personal; dates written `YYYY-MM-DD`; your one-line note about the days-left badge |
| 3 | Three or more new tests in `tests/cases.js`; a screenshot of them failing taken **before** you changed `logic.js`; a green run after; a ticked task that goes grey, leaves Today's plan and the overdue count, and stays in the table; ticks that survive a reload; `prioritise` still not changing the list it was given |
| 4 | A red run of your own new `daysUntil` test using a `today` with a time of day on it, from before the fix; a green run after that includes every older test and the `NaN` test; the same answers at 10:00 and at 23:00; a commit with both `tests/cases.js` and `logic.js`; three sentences that name the **cause**, not just the change you made |
| 5 | Four new tests and `fail 0`; a bad date showing `check the date` with the rest of the page still working; "Add task" with an empty or bad date not crashing; an empty list showing a friendly sentence; `sample-data.js` back to your real tasks and not touched in that commit |
| 6 | The live URL opening on your laptop **and** on your phone with your tasks; the live link in your README; `node check.js --url ...` showing `live 200`; no personal data anywhere in the repo, checked yourself in the data file, the page title, the commit messages and a full-folder search (the safety scan cannot see people's names, so this row is only as good as your own two minutes) |
| 7 | A clean tree and `fail 0`; at most two polish fixes, any logic one with a test written first; a README in your own words carrying the live link, how to run it, what you changed and the Day 4 cause; the live site matching your laptop; seven honest self-score lines; your live URL posted in the shared channel |

Two rows are worth re-reading before you score yourself. **Day 3 and Day 4 both need red evidence that predates the green.** If the only red run you have is one you produced afterwards by commenting the fix out, say so in your self-score; that is a "not met" on the evidence and a "met" on the understanding, and writing that distinction down is more useful than a tick.

**What does not count**, on any row: "done", "tests pass", a tick with nothing attached, a screenshot of your editor with no output, or a description of what you would have done.

## Prompts that help
Prompt 1, the README:
```
I built a small web app this week as a beginner: a day planner that takes my own dated tasks and answers "what should I do today?" (HTML, CSS, plain JavaScript, tests with node --test). Here are my commit messages for the week and my notes on the bug I fixed. Ask me up to five questions you need answered to write a good README, then wait for my answers. Do not write the README yet.

[paste git log --oneline here]
[paste your Day 4 three sentences here]
```

Prompt 2, the last read of the app:
```
Here is the HTML and the CSS for a small app I built. I am about to ship it. Tell me the three things a first-time visitor would find confusing or hard to read, in order. Do not suggest new features, and do not rewrite it; I want the list so I can fix two of them myself.

[paste index.html and app.css here]
```

Prompt 3, a part you did not write:
```
Here is a function from my project that I did not write. Explain it to me in three plain sentences, so that I could say what it does and when it would give a surprising result.

[paste the function here]
```

## Submit
Post in the shared channel, one message (`node check.js --submit 7` prints the skeleton):
- The line `node check.js` printed (your quest log line).
- Your live URL and your fork link.
- Your seven self-score lines, `met` or `not met`, with your evidence named.
- One line: what you would build next.
- One line: something you still do not fully understand.
- Your decision: `continue`, `not now` or `undecided`.

## Done when
- [ ] `git status` clean and `node --test` green.
- [ ] At most two polish fixes, committed and pushed; any logic change had its test written first.
- [ ] README rewritten in your own words, with the live link, how to run it, what you changed and the Day 4 cause.
- [ ] The live site hard-reloads to show your latest work.
- [ ] `node check.js --url ...` shows Days 1 to 6 ticked and level Shipper.
- [ ] Seven self-score lines written, honestly, including any `not met`.
- [ ] Posted in the shared channel with the live URL. Nothing to wait for: the week is finished when you have posted it.

## If you are stuck
1. The live site will not update. Push first (`git status` must be clean and `git push` must say everything is up to date), then wait three minutes, then hard-reload (Ctrl+Shift+R). Still stale? Open the URL in a private tab. The cache is the usual culprit, not your code.
2. A polish fix broke other tests. `git restore logic.js` puts the file back to your last commit; keep the test you wrote and make a smaller change. Shipping Day 6's working version is better than shipping a broken step 3.
3. The README feels impossible to write. Answer these four out loud, then type the answers: What does it do? How do I run it? What did I change this week? What was the bug and how do I know it is fixed? That is the README.
4. Every row of your self-score says "not met" and it feels pointless. Re-read Day 1's row, and check it against `node check.js` output rather than your memory — the quest log ticking Day 6 means Days 1 to 6 passed their mechanical checks already. The rows ask for evidence you almost certainly have.

## Common mistakes
- Adding a feature today. Day 7 is for finishing, not starting. Two small fixes, then stop.
- Skipping the README because the code "speaks for itself". It does not, and in three months it will not speak to you either.
- A self-score of all "met" written in thirty seconds. The rubric is only worth something if you actually read the rows against your own repo.
- Marking a row "met" on a red screenshot you took after the fix. Write down what really happened; that is the more valuable answer.
- Forgetting to hard-reload the live site, then posting a link that shows last week's version.
- Treating `not now` as failure. The repo is yours, the site stays up, and the option stays open.
