# Beagle 7-day trial — the week at a glance

Welcome. In seven days you take a small working app, make it yours, add a feature, fix a real bug, make it robust, put it online and ship it. You use your own AI tool the whole way. What counts is your evidence and your explanation, not how fast you type or how much you knew before.

This trial is free. No card. Nothing is charged at the end.

You need any computer with a browser (Windows, Mac, Linux, a Chromebook, a borrowed laptop) and a free GitHub account. You install nothing: the whole week runs in a browser tab, in a GitHub Codespace. A phone is used once, on Day 6, to check your live site.

## The app you will work on
The Day Planner. You give it your own dated tasks — work, study, side projects, training, family things — and it answers "what should I do today?". It is a plain web page: HTML, CSS and JavaScript. No framework, no server of your own, nothing to install: on Day 1 you fork it and open a Codespace, and everything you need is already there.

The starter also ships two helpers. `check.js` is your quest log: every day ends with `node check.js`, which reads your repo and prints which days are done, your level (Runner, Maker, Builder, Debugger, Tester, Shipper, then Presenter, which you take for yourself once you have shipped and self-scored on Day 7), your XP, what to do next, and one line to post in the shared channel. It changes nothing and sends nothing. And `explainers/` holds five small interactive figures; with the app running, add `/explainers/` to the end of its address to open them. The day files point to them where they help.

## The week
| Day | Outcome | Time | Evidence you post |
|---|---|---|---|
| 1 | Run it: GitHub account, fork, Codespace open, app open, tests green, `planToday` explained | 60–90 min | quest-log line, screenshot of the app, screenshot of green tests, 3 sentences |
| 2 | Make it yours: new name, your colours, your own real week, first commit | 60–90 min | commit link, screenshot, one line about the days-left badge |
| 3 | Add a feature: "Done" checkbox, tests red then green | 90–120 min | commit link with test changes, red screenshot, green screenshot |
| 4 | Find and fix a bug: reproduce, failing test, fix, all green | 90–120 min | failing output, passing output, commit link, 3 sentences on the cause |
| 5 | Make it robust: a bad date and an empty list do not break it | 60–90 min | commit link, test output, 2 screenshots |
| 6 | Put it online: GitHub Pages, works on a phone, no personal data | 45–75 min | live URL, phone screenshot, quest-log line with `live 200` |
| 7 | Ship it: polish, ship the live site, post the link in the shared channel, self-score against the rubric | 60–90 min | the live URL, your self-score |

Total: roughly 8–10 hours; a hard bug can push it towards 12. Do the days in order. Each day builds on the one before.

## House rules
1. **Bring your own AI.** ChatGPT, Claude, Gemini, Cursor, Copilot, any of them; free tiers are fine. Use it for everything. We never ask how much you used it. We do ask you to explain what you did in your own words, and we will ask follow-up questions.
2. **Synthetic data only.** "Synthetic" means made up. The sample tasks are fictional. When you add your own week, use area names, task titles and dates only. No marks, no phone numbers, no roll or employee numbers, no names of classmates, colleagues or teachers, nothing confidential from an employer or a client.
3. **Done means evidence.** Days 1 to 6 are marked done by `node check.js` in your own copy, not by a person: run it, and it tells you. You still post the evidence listed for that day in the shared channel, because that is how anyone else can learn from it and how you have something to self-score against on Day 7. A tick in your head does not count. A commit link, a screenshot or test output does.
4. **No job promise.** This week gives you a working app in your own GitHub account and the ability to explain it. It does not promise a job, a placement or an income. Nobody at Beagle will tell you otherwise.
5. **No secrets.** Never put passwords, API keys or tokens into the app, the repo or the shared channel. The app makes no network calls and needs none.
6. **Your work is yours.** The repo is in your account. You keep it after the week, whatever you decide on Day 7.

## How to submit each day
Post one message in the shared channel (the cohort WhatsApp group). That channel is the whole cohort: every learner in this round, plus Adi. Everything you post, and every answer anyone gets, is visible to all of them. That is deliberate.

Posting is not a request for a verdict. `check.js` has already decided whether the day is done; you post so the cohort can see the work, and so someone can say something if it looks off.

```
Day N — done
[the line node check.js printed]
[evidence 1: link or screenshot]
[evidence 2]
[the sentences the day asks for]
Hardest part today: one line
```

`node check.js` answers immediately, every time, with what is done and what is next. It is the whole gate for Days 1 to 6: when it ticks the day, the day is done, and there is no human marking step and nobody to wait for. If it does not tick, it names what is missing; fix that and run it again. Day 7 is the one day it cannot score, so you score that one yourself against the rubric in `days/day-7.md`. Either way you post your evidence line in the shared channel, where everyone can see it and anyone can help.

## Where to get help
1. **Your AI first.** Paste the error, the file and what you expected. Every day file gives you prompts that work.
2. **The shared channel second.** Ask like this, every time: what you tried, what you expected, what you saw (screenshot or pasted text). "It doesn't work" on its own gets a question back, not an answer.
3. **A written answer from Adi, within one business day**, posted in the same channel so everyone can see it. He reads the channel once a day on weekdays. There are no weekday calls, no one-to-one sessions and no fixed hour window on anyone's clock: this is a written queue, not a hotline, and it is honest about that.
4. Stuck for more than a day? Say so in the shared channel, and say what you have already tried. It gets picked up in the next written pass.

Before all of these: run `node check.js`. It is a program, it answers in a second, and it is right about whether the day is done.

No direct messages for technical help. Questions in the shared channel help everyone, and someone else usually has the same one. Answering someone else's question counts as work this week.

## Words you will meet every day
Each day file defines its own words where they first appear. These five come up all week:
- **Terminal**: the panel at the bottom of the editor in your Codespace, where you type commands.
- **Repository (repo)**: a folder whose history Git remembers. Yours lives on GitHub, and your Codespace works on a copy of it.
- **Commit**: a saved snapshot of your repo, with a one-line message saying what changed.
- **Push**: copying your commits from your Codespace up to GitHub.
- **Test**: a small program that checks one fact about your code and prints pass or fail.
- **Quest log**: what `node check.js` prints: the days you have completed, your level and XP, and the one line to post.
