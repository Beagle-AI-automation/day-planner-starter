# Day 4 — Find and fix the bug

## Today you will
Reproduce a real bug in the days-left badge, write a test that fails because of it, trace the cause, fix it, and prove with the tests that nothing else broke.

## You will need
- Day 3 done and pushed.
- Your Day 2 note about the badge.
- 90–120 minutes.
- Your editor, terminal and AI.

**Words used today**
- **Bug**: the code does something other than what it should. This one is real; it shipped in the starter on purpose for you to find.
- **Reproduce**: make the bug happen on purpose, whenever you want. You cannot fix what you cannot reproduce.
- **Trace**: follow one input through the code and write down the value at each step.
- **Root cause**: the line or assumption that creates the wrong value, as opposed to the place where you first notice it (the badge).
- **Milliseconds**: JavaScript measures time in milliseconds since 1 January 1970. `86400000` is the number of milliseconds in one day.
- **Scratch file**: a throwaway file you create to try something, then delete. `.mjs` is a JavaScript file that is allowed to `import` from other files.
- **Math.floor**: rounds down to the whole number below. `Math.floor(0.8)` is 0. `Math.floor(-0.2)` is -1, not 0. Remember that second one.
- **Calendar days versus elapsed time**: a stopwatch measures how much time passed between two moments (hours and minutes matter). A calendar asks only which date each side is and counts the dates in between (the time of day does not matter). "Due in 1 day" is a calendar question.

## Steps
1. Reproduce it. Open the app. Set the "Today" input (the date box at the top) to the exact due date of one of your tasks. Look at that task's badge, the small label in the days-left column of the table. Then set "Today" to one day before that due date and look again. You should see: a badge that does not match what you would count on a calendar (compare with your Day 2 note). Write down the exact values: the "Today" date, the task's due date, the badge the app shows, the badge you expected.

2. Find the function behind the badge. In `app.js` search for `daysUntil`. You should see: the badge text is built from the number that `daysUntil` returns. Now open `logic.js` and read `daysUntil`. You should see: a short function that takes `dueISO` (a date string like `'2026-11-05'`) and `today` (a Date) and returns a number.

3. Call it directly, outside the app. In your editor choose File → New File, paste the three lines below, and save it as `scratch.mjs` inside the project folder (the same folder as `logic.js`):
   ```js
   import { daysUntil } from './logic.js';
   console.log('due today    ->', daysUntil('2026-11-05', new Date('2026-11-05T10:00:00')));
   console.log('due tomorrow ->', daysUntil('2026-11-06', new Date('2026-11-05T10:00:00')));
   ```
   (The first line borrows `daysUntil` from `logic.js` so this file can call it; the other two call it and print the answers. `new Date('2026-11-05T10:00:00')` is 5 November 2026 at 10:00 on your Codespace's clock. The app builds `today` with a time of day in it too.) Run `node scratch.mjs`. You should see: two numbers. Ask yourself what they should be: a task due on 5 November when today is 5 November, and one due on 6 November. Compare with what printed.

4. Write the failing tests. In `tests/cases.js` add two tests, copying the shape you used on Day 3, next to the other `daysUntil` tests: `daysUntil: a task due today is 0 days away, even at 10 in the morning` and `daysUntil: a task due tomorrow is 1 day away, even at 10 in the morning`. Do not use the file's `day()` helper for these: it makes midnight, and this bug hides at midnight. Build the Date yourself. The whole first test is:
   ```js
   {
     name: 'daysUntil: a task due today is 0 days away, even at 10 in the morning',
     run() { assertEqual(daysUntil('2026-11-05', new Date('2026-11-05T10:00:00')), 0); },
   },
   ```
   The second uses due `'2026-11-06'` and expects `1`. Run `node --test`. You should see: `fail 2`. Screenshot the output; this is your red evidence. (If they pass, your test is not using a `today` with a time of day. Check the hour.)

5. Trace it. Inside `daysUntil` in `logic.js`, on the first line inside the function's curly brackets, add a temporary line that prints the two values being subtracted and the result of the subtraction: `console.log(new Date(dueISO), today, new Date(dueISO) - today);`. (`console.log` prints whatever you give it to the terminal.) Run `node scratch.mjs` again. You should see: two printed dates and a number of milliseconds for each call. Write all of it down. Look at the time part of each printed date, and at the sign of the number.

6. Explain the gap in one sentence before you fix anything. Use Prompt 2 if you need help noticing. You should see: a sentence in your notes of the form "the two values being subtracted are ..., so the result is ..., so Math.floor turns it into ...". Do not move on until you have this sentence; it becomes your root-cause explanation.

7. Fix `daysUntil`. Change it so that it compares the two dates the way a calendar does, not the way a stopwatch does (see the word list): the function should give the same answer at 00:01 and at 23:59 on the same day, because only the dates matter. This is the hard step of the week. Use Prompt 1 and Prompt 2 first; if you are still stuck after 15 minutes, read the three hints under "If you are stuck" in order. They are written to be used, not as a last resort. Keep two things: it must still return `NaN` for a string that is not a date (an existing test checks this), and it must not change `today` (it is given to you; leave it as it was). Remove your temporary `console.log` lines. Run `node --test`. You should see: `fail 0`, with your two new tests passing and every older test still passing.

8. Try the fix at a different time of day. In `scratch.mjs` change `T10:00:00` to `T23:00:00` in both lines and run it again. You should see: still `0` and `1`. If a different hour gives different answers, the fix is not finished; see "Common mistakes".

9. Check the app. Reload, set "Today" to a due date. You should see: "Due today" (or 0) for that task; one day earlier, 1 day left; one day later, overdue.

10. Delete `scratch.mjs`. Run `git status` to confirm only `logic.js` and `tests/cases.js` changed. Commit and push: `git add .` then `git commit -m "Fix daysUntil off-by-one: compare calendar dates, failing test first"` then `git push`. You should see: a commit on GitHub with exactly those two files.

11. Run your quest log: `node check.js`. You should see: Day 4 ticked, level Debugger, and a line starting `Day 4` to post. It checks `daysUntil` at 14:00 and at 23:30; if it says the badge is still off, your fix still depends on the time of day (Step 8).

12. Write three sentences on the root cause, one for each: (1) what was wrong, naming the two values that were being subtracted and why that gave the wrong number; (2) what you changed; (3) how you know it works, naming the tests. You should see: three sentences you could say out loud without reading.

## Prompts that help
Prompt 1, understanding the values:
```
Here is a small JavaScript function. Explain what each expression evaluates to when dueISO is '2026-11-05' and today is new Date('2026-11-05T10:00:00'). Show the intermediate values, including exactly what new Date('2026-11-05') is (date, time, time zone) and what today is. Do not suggest a fix yet. I want to understand the values first.

[paste only the daysUntil function here]
```

Prompt 2, noticing without being told:
```
I printed these values inside the function and the result is one less than I expect. Ask me three questions, one at a time, that would help me notice why. Wait for my answer after each question. Do not tell me the answer.

[paste what your console.log printed]
```

Prompt 3, reviewing your fix:
```
Here is my fixed daysUntil and my test output. Review it: does it still return NaN for a string that is not a date? Does it change the today value it was given? Is there any time of day, or any day of the year, where it still gives the wrong answer? Point at the line; do not rewrite it.

[paste your daysUntil and the node --test output here]
```

## Submit
- The line `node check.js` printed (your quest log line).
- Screenshot or pasted text of the red run (your new tests failing), taken before the fix.
- Screenshot or pasted text of the green run after the fix.
- Commit link (must include `tests/cases.js` and `logic.js`).
- Your three sentences on the root cause.
- Hardest part today: one line.

## Done when
- [ ] The failing tests existed before the fix (red evidence posted).
- [ ] After the fix: `fail 0`, including the older `daysUntil` tests and the `NaN` test.
- [ ] The fix gives the same answers at 10:00 and at 23:00 (Step 8).
- [ ] The app shows the correct badge for due today, due tomorrow and overdue.
- [ ] No `console.log` left in `logic.js`; `scratch.mjs` deleted.
- [ ] Your three sentences name the cause, not just "I changed the function".
- [ ] `node check.js` shows Day 4 ticked.
- [ ] Evidence line posted in the shared channel. Nothing to wait for: `check.js` decided the day.

## If you are stuck
1. You cannot see what is wrong: print the two values being subtracted, as Step 5 says, and compare their time parts, not just their dates. One of them is always at a fixed time of day. The other carries whatever time it was given.
2. `new Date('2026-11-05')`, a string with no time part, means midnight at the start of that day, but midnight in UTC (universal time, the zero time zone), not midnight on your clock. India is 5 hours 30 minutes ahead of UTC. `today` is a local time with hours in it. Subtracting a morning in India from midnight UTC on the same date gives a small negative number of milliseconds, and `Math.floor` pushes any negative fraction down to -1. That is your "one day less". To see this mechanism move, open `explainers/calendar-days-vs-clock-time.html` and choose **Open Preview** (right-click the file) and drag the clock.
3. What you want is the number of calendar days between two dates, not the number of 24-hour spans between two moments. Build a date-only value for each side from year, month and day alone, and only then subtract. JavaScript has `Date.UTC(year, month, day)` for exactly this. `today.getFullYear()`, `today.getMonth()` and `today.getDate()` give you today's parts. For `dueISO`, pull the three numbers out of the string (a regular expression such as `/^(\d{4})-(\d{2})-(\d{2})$/`, or `split('-')`), and remember the string's month is 1-based while `Date.UTC` counts months from 0. If the string does not match, return `NaN`. Once both sides are whole days apart, divide by `86400000` and round.

## Common mistakes
- Swapping `Math.floor` for `Math.ceil` or `Math.round` and calling it fixed. Your 10:00 tests may go green while 23:00 is still wrong. Step 8 catches this. The problem is the values being subtracted, not the rounding.
- Adding `+ 1` to the badge in `app.js`. The bug is in the logic; the badge is only where you noticed it. Fix it where it lives.
- Writing the test after the fix. It is green immediately and proves nothing, to anyone else or to you. The red screenshot is the evidence; take it before you touch `logic.js`.
- Breaking the `NaN` test: a string that is not a date must still give `NaN`. Day 5 depends on it.
- Changing `today` inside the function (for example calling a `set...` method on it). The function is given `today`; it must not alter it.
- Leaving `console.log` in `logic.js` or committing `scratch.mjs`.
