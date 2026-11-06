# Day 1 — Run it

## Today you will
Get your own copy of the Day Planner, open it in your browser, run its tests, and explain one function in three sentences.

**You install nothing.** The whole week runs in a browser tab.

## You will need
- Any computer with a browser. Windows, Mac, Linux, a Chromebook, a borrowed laptop: all fine. About 60–90 minutes the first time, most of it waiting and reading.
- Internet.
- A GitHub account (free). If you do not have one, you make it in Step 1. It takes two minutes.
- Your AI tool open in another browser tab.
- The starter repository link. It is posted in the shared channel on Day 1 morning.

**Why no installs:** GitHub gives every repository a free computer in the cloud, called a **Codespace**. It already has everything this project needs. You click a button, a code editor opens in your browser, and you are working. Nothing touches your own machine, so nothing can go wrong with it.

**Words used today**
- **GitHub**: a website that stores code projects online, free. **Repository (repo)**: one project on it. **Fork**: your own copy of someone else's repo, under your name, made with one click.
- **Codespace**: a computer GitHub runs for you in the cloud, with a code editor you use in your browser. Everything this week happens inside one. It is not your laptop, so you cannot break your laptop.
- **Terminal**: the panel at the bottom of the editor where you type commands. A dozen or so this week, every one of them given to you.
- **Preview tab**: when the app runs, the editor opens it in a tab of its own, named Your app. The small icon at that tab's top right opens the same page in a normal browser tab.
- **Node**: the program that runs this project's code and its tests. It is already installed in your Codespace.
- **Test**: a small program that checks one fact about the code and prints pass or fail. "Green" means all tests pass.
- **Function**: a named block of code that takes some input and gives back an output. `planToday` is one.
- **Quest log**: the starter includes a small program, `check.js`. Running `node check.js` prints which days you have completed, your level and XP, what to do next, and one line to post in the shared channel. It is what decides whether a day is done. It reads your folder and sends nothing anywhere.
- **Editor**: the program you use to open and change text files. The files in this project are all plain text.

## Steps

1. **Get a GitHub account** (skip if you have one). Open https://github.com and click **Sign up**. Use a personal email you will keep for years, not a college or work one that stops working when you leave. Pick a username you would be happy to show on a CV: it becomes part of your app's web address on Day 6. Verify your email when GitHub asks.
   **You should see:** your GitHub home page, signed in, your username at the top right.

2. **Fork the starter.** "Fork" means make your own copy, under your own name, with one click. Open the starter repository link from the shared channel. Near the top right, click **Fork**, then **Create fork**.
   **You should see:** the same-looking page, but the address bar now reads `github.com/YOUR-USERNAME/day-planner-starter`. This copy is yours. You can change anything in it and nothing happens to the original.

3. **Open your Codespace.** On **your** fork (check your username is in the address bar), click the green **Code** button, choose the **Codespaces** tab, then click **Create codespace on main**. Wait. The first time takes two to three minutes, because GitHub is building your computer in the cloud. Later visits take seconds.
   **You should see:** a code editor fill your browser tab. On the left, a list of the project's files. At the bottom, a panel with a blinking cursor: that is the terminal. When it finishes setting up it prints `Ready. Node is installed. Nothing else to set up.`

4. **Look around.** In the file list on the left, click `logic.js`. It opens. Click `index.html`. It opens in another tab. You are not expected to understand these yet; you are just seeing that the files are real and you can open them.
   **You should see:** file contents in the middle of the screen. Nothing has broken.

5. **Run the app.** In the terminal at the bottom, type `npx serve .` and press Enter. Say `y` if it asks to install. After a few seconds a tab named **Your app** opens inside the editor by itself, with the page in it. The small icon at that tab's top right opens the same page in a normal browser tab, which is handy for screenshots.
   **You should see:** a web page titled Day Planner with today's date, a number of hours available, a table of 12 made-up tasks across six areas (work, freelance, a course, fitness, family, a job hunt) with a days-left badge on each, a "Today's plan" panel and a "Clashes" panel.
   *If no tab opened:* click the **Ports** tab next to the terminal, find port 3000, and click the little globe icon on that row.

6. **Use the app for two minutes.** Change the "Today" date. Change "Hours available today". Watch the plan panel and the badges update.
   **You should see:** the plan and the badges change as you change the inputs. If anything looks surprising, write it down. Do not fix anything today; today is for running, not changing.

7. **See how it fits together.** The explainers are web pages, so you open them in the running app, not in the editor (the editor shows a web page as code). In the preview tab's address bar, add `explainers/how-your-app-runs.html` after the final `/` and press Enter. This is how you open every explainer all week. Spend three minutes with it, then press the back arrow in the preview to return to the app.
   **You should see:** an interactive figure showing how the page, the data file and the logic file work together.

8. **Run the tests.** Leave the server running. Open a second terminal with the **+** at the top right of the terminal panel, then type `node --test` and press Enter. A test is a tiny program that checks one fact about the code, for example "a task of type `exam` weighs 4". Running them means letting the computer execute every check and print the result.
   **You should see:** one line per test with a tick or `ok`, then a summary that includes `pass` with a number and **`fail 0`**.

9. **Read `logic.js` with your AI.** `logic.js` holds the app's rules: how days are counted, how tasks are ordered, how today's plan is chosen. Click it in the file list, click inside it, select all (`Ctrl+A` or `Cmd+A`), copy, and paste it into your AI chat under Prompt 1 below. Read the answer slowly; it is about 10 minutes of reading. Then open `explainers/todays-plan-hopper.html` the same way as Step 7 (add it after the `/` in the preview's address): it shows `planToday` choosing tasks for a day, and you can change the hours and watch what gets picked. Play with it for five minutes.
   **You should see:** you can point at a line in `logic.js` and say roughly what it does.

10. **Write three sentences about `planToday`:** what goes in, what comes out, and the rule that decides which tasks are chosen. Your own words.
   **You should see:** three sentences you could say out loud to a friend who has not seen the code.

11. **Take two screenshots:** the app in the preview, and the green tests (the terminal with `fail 0`, or the same tests in the browser: add `tests/browser.html` after the `/` in the preview's address, and every name shows PASS). Windows: press Win+Shift+S and drag over the area. Mac: press Cmd+Shift+4 and drag over the area.
   **You should see:** two images ready to post.

12. **Run your quest log.** In a terminal, type `node check.js` and press Enter. You should see: a short report with Day 1 ticked, your level (Runner) and XP, "Next quest: days/day-2.md", and a line that starts with `Day 1` under "Post this in the shared channel". Copy that line; it goes in your submission.

## Prompts that help
Prompt 1, for reading `logic.js`:
```
I am a beginner who has never written a program. Here is a JavaScript file from a small app I am learning from. Explain it to me function by function, in plain English, two or three sentences each. Do not rewrite or improve the code. After each function, give me one example input and the output it would produce. End by asking me one question that checks whether I understood planToday.

[paste the whole of logic.js here]
```

Prompt 2, when something does not work:
```
I am working in a GitHub Codespace in my browser. I ran this: [command or what I clicked]. I saw this: [paste the exact message]. Explain what the message means in one short paragraph, then give me the single next step. Do not give me five options.
```

Prompt 3, for the tests:
```
Here is a test file from my project. Pick one test and explain: what function it calls, what input it gives, what answer it expects, and what "pass" means for it. Then explain in two sentences what the command node --test does. Do not change the file.

[paste tests/cases.js or tests/logic.test.js here]
```

## Submit
Post in the shared channel:
- The line `node check.js` printed (your quest log line).
- Screenshot of the app open in your browser preview.
- Screenshot of the green tests (terminal with `fail 0`, or `tests/browser.html` with all PASS, opened through the app's address).
- Your three sentences about `planToday`.
- The link to your fork (`github.com/YOUR-USERNAME/day-planner-starter`).
- Hardest part today: one line.

## Done when
- [ ] Your Codespace opened and the terminal printed that Node is ready.
- [ ] Your fork exists under your GitHub username.
- [ ] The app opened in a browser tab with tasks showing.
- [ ] Tests are green: `fail 0` in Node (preferred) or all PASS in the browser.
- [ ] Three sentences about `planToday` posted, in your own words.
- [ ] `node check.js` shows Day 1 ticked and you posted its line.
- [ ] Evidence line posted in the shared channel. Nothing to wait for: `check.js` decided the day.

## If you are stuck
1. **The Codespace is slow to open the first time.** Two to three minutes is normal; it is building a machine for you. Do not refresh. Later visits take seconds.
2. **You closed the tab.** Nothing is lost. Go back to your fork on github.com, click **Code → Codespaces**, and click the one already listed. It reopens where you left it.
3. **`npx serve .` prints an address that does not end in 3000.** A server is already running from before, so this one took another port. Press `Ctrl+C` in this terminal, then open the **Ports** tab next to the terminal and click the globe icon on the port 3000 row.
4. **The app opens but the page is blank.** Check the address ends in `/` or `/index.html`. If it still looks empty, stop the server with `Ctrl+C` and run `npx serve .` again.
5. **An explainer shows code instead of a picture.** You opened it in the editor. Open it in the running app instead: in the preview tab's address bar add `explainers/` and the file name after the final `/` (Step 7). If the server is not running, start it with `npx serve .` first.
6. **Anything else:** copy the exact message into your AI with Prompt 2 below, then post it in the shared channel with what you already tried. Do not spend an hour alone on it.

## Common mistakes
- **Opening the Codespace on the original repo instead of your fork.** Check your own username is in the address bar before Step 3. If it says `Beagle-AI-automation`, go back and fork first.
- **Pasting the AI's explanation as your three sentences.** You will be asked a follow-up in the shared channel, and a paste falls apart on the first one. Write them yourself; they can be simple.
- **Trying to fix something that looks odd in the app.** Today is for running, not changing. Write it down and keep going.
- **Spending an hour stuck alone.** Prompt 2, then the shared channel.
