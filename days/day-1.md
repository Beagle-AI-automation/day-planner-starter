# Day 1 — Run it

## Today you will
Install Git and Node, get your own copy of the Day Planner onto your laptop, open it, run its tests and explain one function in three sentences.

## You will need
- A laptop with Windows or macOS (Linux notes are included). About 90–150 minutes. Today is the longest day because of the installs.
- Internet, for the downloads.
- A GitHub account (free). If you do not have one, you make it in Step 5.
- Your AI tool open in a browser tab.
- A text editor. If you already have VS Code or Cursor, use it. If not, Notepad (Windows) or TextEdit (Mac) is enough for this week. On Mac, open TextEdit, choose Format → Make Plain Text once, before you edit any file.
- The starter repository link. It is posted in the shared channel on Day 1 morning.

**Words used today**
- **Terminal**: the window where you type commands. On Windows we use PowerShell. On Mac, Terminal.
- **Git**: a program that remembers every version of your files. **GitHub**: a website that stores Git projects online, free.
- **Node**: a program that runs JavaScript outside a browser. We use it to run tests.
- **Repository (repo)**: a project folder that Git tracks. **Fork**: your own copy of someone else's repo, on GitHub, under your name. **Clone**: copying a repo from GitHub to your laptop.
- **Test**: a small program that checks one fact about the code and prints pass or fail. "Green" means all tests pass.
- **Function**: a named block of code that takes some input and gives back an output. `planToday` is one.
- **Quest log**: the starter includes a small program, `check.js`. Running `node check.js` prints which days you have completed, your level and XP, what to do next, and one line to post in the shared channel. It is what decides whether a day is done. It reads your folder and sends nothing anywhere.
- **Editor**: the program you use to open and change text files. The files in this project are all plain text.

## Steps
1. Open a terminal. Windows: press the Windows key, type `powershell`, press Enter. Mac: press Cmd+Space, type `terminal`, press Enter. You should see: a window with a blinking cursor, waiting for you to type.

2. Check what is already installed. Type `git --version` and press Enter. Then type `node --version` and press Enter. You should see: for each one, either a version number (like `git version 2.47.0` or `v22.11.0`) or a message saying the command is not found or not recognised. "Not found" simply means that program is not installed yet; Step 3 installs Git and Step 4 installs Node. Note which you got. You only install what is missing: Git if it is missing, Node if it is missing or older than v22 (the number after the `v`). (Mac: `git --version` may open a window offering to install "command line developer tools". Click Install, wait for it to finish, then run `git --version` again. That is Apple's official Git, and you can skip Step 3.)

3. Install Git (skip if Step 2 printed a Git version).
   - Windows: open https://git-scm.com/downloads , click **Windows**, then click the 64-bit **Git for Windows Setup** download. Run the downloaded file. The installer has many pages. Keep every default and click **Next** on each page until you reach **Install**, then **Finish**.
   - Mac: open https://git-scm.com/downloads , click **macOS** and follow that page. If Step 2 already offered the developer tools, you are done.
   - Linux: the same page has a **Linux** section with the one-line install command for your distribution.
   Close the terminal, open a new one (installs are not visible to a terminal that was already open), and type `git --version`. You should see: a version number.

4. Install Node (skip if Step 2 printed `v22` or higher; an older Node cannot run the tests, which use a modern `import` syntax).
   Open https://nodejs.org/en/download . Pick your operating system. Choose the **prebuilt installer** option (not "package manager", not "binaries"). Leave the version on **LTS** (Long Term Support, the stable one). Download it and run it. Keep every default. Windows: if a page offers to "automatically install the necessary tools", leave it unticked; you do not need them. Close the terminal, open a new one, and type `node --version`. You should see: a version number of `v22` or higher. The LTS installer from nodejs.org is new enough. If you still see an older number, the old version is still first in line: run the installer again, click through to Finish, and open a new terminal.

5. Create a GitHub account (skip if you have one). Open https://github.com and click **Sign up**. Use a personal email you will keep for years, not one from a college or an employer that may stop working when you leave. Pick a username you are happy to show on a CV: it will be part of your app's web address on Day 6. Verify your email when GitHub asks. You should see: your GitHub home page, signed in, with your username at the top right.

6. Fork the starter. "Fork" means: make your own copy of this project under your own GitHub account, with one click, on the GitHub website. Open the starter repository link from the shared channel (it is a page on github.com). Near the top right of that page, click the button labelled **Fork**, then on the next page click **Create fork**. You should see: a page that looks the same as before, but the address bar now reads `github.com/YOUR-USERNAME/day-planner-starter` with your own username in it. This copy is yours. You can change anything in it and nothing happens to the original.

7. Get it onto your laptop. This is called "cloning": copying your fork from the GitHub website to a folder on your laptop, so you can open and edit the files. If you have never used Git, do Option A. Only pick B if you already type Git commands.
   - **Option A, buttons (the default).** Open https://desktop.github.com and install GitHub Desktop (Windows and Mac). Open it. It asks you to sign in to GitHub; click the button and sign in through your browser. Then in GitHub Desktop choose the menu **File → Clone repository**. A window lists your repositories on GitHub; click `day-planner-starter`, then click **Clone**. It copies the files and shows the folder path, usually `Documents\GitHub\day-planner-starter` on Windows or `Documents/GitHub/day-planner-starter` on Mac. Write that path down; you will type it in Step 8.
   - **Option B, typing.** On your fork's page on github.com click the green **Code** button. A small panel opens showing a web address ending in `.git`; that is the HTTPS link. Click the copy icon next to it. In the terminal type `cd Desktop` and press Enter, then type `git clone ` (with a space after it), paste the link, and press Enter. Git prints a few lines and makes the folder on your Desktop.
   - **Fallback if both fail.** On your fork's page click **Code** → **Download ZIP**. Extract the ZIP to your Desktop (right-click → Extract All on Windows; double-click on Mac). You can still do every day; Day 2 explains how to save changes through the website instead of Git.
   You should see: a folder called `day-planner-starter` on your laptop. Open it in your file manager. It contains `index.html`, `app.css`, `app.js`, `logic.js`, `sample-data.js`, `check.js`, `README.md`, `LICENSE` and four folders: `days`, `tests`, `quest` and `explainers`.

8. Open the app. `index.html` is the web page itself; a browser can open it straight from a folder, no internet needed. Any browser works; Chrome or Edge is simplest. In the folder from Step 7, double-click `index.html`. It opens in your browser. You should see: a web page titled Day Planner with today's date, a number of hours available, a table of 12 made-up tasks across six areas (work, freelance, a course, fitness, family, a job hunt) with a days-left badge on each, a "Today's plan" panel and a "Clashes" panel. There is a second way to open the same app, which you will meet again later in the week: in the terminal, move into the folder (`cd Desktop\day-planner-starter` on Windows, `cd Desktop/day-planner-starter` on Mac; if you used GitHub Desktop the folder is under Documents/GitHub), type `npx serve .` and press Enter, say `y` if it asks to install, then open the address it prints (usually `http://localhost:3000`). Both ways show the same page. To see how the pieces fit together, double-click `explainers/how-your-app-runs.html` in the `explainers` folder and spend three minutes with it. You should see: an interactive figure showing how the page, the data file and the logic file work together.

9. Run the tests in the browser. A test is a tiny program that checks one fact about the code, for example "a task of type `exam` weighs 4". "Running" the tests means letting the computer execute each check and print the result. The starter has a page that does this. Inside the `tests` folder, double-click `browser.html`. You should see: a list of short test names, each marked PASS. (On a laptop set to a time zone behind UTC, such as the Americas, a few date tests may show FAIL with a note explaining why; the next step, `node --test`, is the result that counts.)

10. Run the tests with Node. In the terminal, make sure you are inside the folder (type `dir` on Windows or `ls` on Mac; you should see `logic.js` in the list). Type `node --test` and press Enter. You should see: one line per test with a tick or `ok`, then a summary that includes `pass` with a number and `fail 0`.

11. Take two screenshots: the app in the browser, and the green tests (the terminal with `fail 0`, or the browser page with all PASS). Windows: press Win+Shift+S, drag over the area, then paste with Ctrl+V straight into WhatsApp; or press Win+PrtScn to save a file in Pictures\Screenshots. Mac: press Cmd+Shift+4, drag over the area; the file appears on your Desktop. You should see: two images ready to post.

12. Read `logic.js` from top to bottom with your AI. `logic.js` is the file that holds the app's rules: how days are counted, how tasks are ordered, how today's plan is chosen. It is plain text. Open it in your editor: in VS Code or Cursor use File → Open Folder and pick the project folder, then click `logic.js` in the left-hand list; in Notepad or TextEdit, right-click the file → Open with → your editor. Select all (Ctrl+A or Cmd+A), copy, and paste it into your AI chat under Prompt 1 below. Read the answer slowly; it is about 10 minutes of reading. Then double-click `explainers/todays-plan-hopper.html`: it shows `planToday` choosing tasks for a day, and you can change the hours and watch what gets picked. Play with it for five minutes. Then close both windows and write three sentences about `planToday`: what goes in, what comes out, and the rule that decides which tasks are chosen. You should see: three sentences in your own words, each one you could say out loud to a friend who has not seen the code.

13. Use the app for two minutes. Change the "Today" date. Change "Hours available today". Watch the plan panel and the badges update. You should see: the plan and the badges change as you change the inputs. If anything looks surprising, write it in your notes. Do not fix anything today; today is for running, not changing.

14. Run your quest log. In the terminal, inside the folder, type `node check.js` and press Enter. You should see: a short report with Day 1 ticked, your level (Runner) and XP, "Next quest: days/day-2.md", and a line that starts with `Day 1` under "Post this in the shared channel". Copy that line; it goes in your submission.

## Prompts that help
Prompt 1, for reading `logic.js`:
```
I am a beginner who has never written a program. Here is a JavaScript file from a small app I am learning from. Explain it to me function by function, in plain English, two or three sentences each. Do not rewrite or improve the code. After each function, give me one example input and the output it would produce. End by asking me one question that checks whether I understood planToday.

[paste the whole of logic.js here]
```

Prompt 2, for install trouble:
```
I am installing [Git / Node] on [Windows 11 / macOS]. I ran this command: [command]. I saw this: [paste the exact message]. Explain what the message means in one short paragraph, then give me the single next step. Do not give me five options.
```

Prompt 3, for the tests:
```
Here is a test file from my project. Pick one test and explain: what function it calls, what input it gives, what answer it expects, and what "pass" means for it. Then explain in two sentences what the command node --test does. Do not change the file.

[paste tests/cases.js or tests/logic.test.js here]
```

## Submit
Post in the shared channel:
- The line `node check.js` printed (your quest log line).
- Screenshot of the app open on your laptop.
- Screenshot of the green tests (terminal with `fail 0`, or `tests/browser.html` with all PASS).
- Your three sentences about `planToday`.
- The link to your fork (`github.com/YOUR-USERNAME/day-planner-starter`).
- Hardest part today: one line.

## Done when
- [ ] `git --version` and `node --version` both print a version number.
- [ ] Your fork exists under your GitHub username.
- [ ] The folder is on your laptop and the app opens with tasks showing.
- [ ] Tests are green: `fail 0` in Node (preferred) or all PASS in the browser.
- [ ] Three sentences about `planToday` posted, in your own words.
- [ ] `node check.js` shows Day 1 ticked and you posted its line.
- [ ] Evidence line posted in the shared channel. Nothing to wait for: `check.js` decided the day.

## If you are stuck
1. After any install, close the terminal and open a new one, then run the version command again. A terminal that was open before the install cannot see the new program. This fixes most "not recognised" and "command not found" messages.
2. `node --test` prints `SyntaxError: Cannot use import statement outside a module`: your Node is older than 22. Go back to Step 4, install the LTS version, open a new terminal, check `node --version`. Windows says `running scripts is disabled on this system` when you type `npx`: type `npx.cmd serve .` instead. `node --test` and `node check.js` are not affected. If a different command fails on Windows, try the same command in Command Prompt (Windows key, type `cmd`, Enter) rather than PowerShell.
3. `node --test` prints nothing, or says no tests were found: you are in the wrong folder. Type `dir` (Windows) or `ls` (Mac). If you cannot see `logic.js` and `tests`, use `cd` to move into the right folder (you can type `cd ` with a space and then drag the folder from your file manager onto the terminal window to fill in the path). If you can see them, run `node --test tests/logic.test.js` instead.

## Common mistakes
- Running `git clone` and then running `node --test` without moving into the new folder. `cd day-planner-starter` first.
- Downloading Node's "package manager" or "binaries" option instead of the installer. Go back and pick the installer.
- Pasting the AI's explanation as your three sentences. You will be asked a follow-up question about them in the shared channel, and a paste falls apart on the first one. Write the sentences yourself; they can be simple.
- Trying to fix something that looks odd in the app. Today is for running, not changing. Write it down and keep going.
- Editing files in TextEdit's rich-text mode on Mac. The file gets curly quotes and stops working. Format → Make Plain Text first.
- Spending an hour on an install error alone. Paste the exact message into your AI with Prompt 2, then into the shared channel with what you tried.
