// sample-data.js — the tasks the planner starts with. This is the ONLY copy.
//
// On Day 2 you replace these with your own real week: work, study, side projects,
// training, family things. Whatever you actually have to get done. Keep the shape:
//   { "id": 1, "course": "...", "title": "...", "type": "exam|practical|record|assignment",
//     "due": "YYYY-MM-DD", "hours": 2, "done": false }
//
// `course` is just the area a task belongs to — a client, a job, a class, your own
// life. The four `type` values are buckets, and the app only uses them to break a tie
// when two things fall on the same day (heaviest first):
//   exam       something fixed and high-stakes: a test, an interview, a race, a demo
//   practical  hands-on time: a lab, a session at the gym, pairing on a bug
//   record     something you have to write up
//   assignment any other piece of work with a deadline
//
// Every task needs its own id. Areas, titles and dates only: no marks, no people's names.
// Check it with:  node -e "console.log(require('./sample-data.js').length + ' tasks ok')"

const sampleTasks = [
  {"id": 1, "course": "Work", "title": "Sprint retro write-up", "type": "record", "due": "2026-11-01", "hours": 2, "done": false},
  {"id": 2, "course": "Freelance", "title": "October invoice to the client", "type": "assignment", "due": "2026-11-03", "hours": 2, "done": false},
  {"id": 3, "course": "Fitness", "title": "Gym: legs and core session", "type": "practical", "due": "2026-11-04", "hours": 3, "done": false},
  {"id": 4, "course": "AI course", "title": "Module 2 quiz", "type": "exam", "due": "2026-11-06", "hours": 4, "done": false},
  {"id": 5, "course": "Freelance", "title": "Landing page copy, first draft", "type": "assignment", "due": "2026-11-07", "hours": 2, "done": false},
  {"id": 6, "course": "Family", "title": "Book the flights for the trip", "type": "assignment", "due": "2026-11-10", "hours": 1, "done": false},
  {"id": 7, "course": "AI course", "title": "Build the chatbot exercise", "type": "practical", "due": "2026-11-12", "hours": 3, "done": false},
  {"id": 8, "course": "Work", "title": "Pair on the payments bug", "type": "practical", "due": "2026-11-14", "hours": 2, "done": false},
  {"id": 9, "course": "Work", "title": "Trip expense report", "type": "record", "due": "2026-11-18", "hours": 2, "done": false},
  {"id": 10, "course": "AI course", "title": "Certification exam", "type": "exam", "due": "2026-11-24", "hours": 6, "done": false},
  {"id": 11, "course": "Job hunt", "title": "Interview: platform team", "type": "exam", "due": "2026-11-24", "hours": 5, "done": false},
  {"id": 12, "course": "Fitness", "title": "10 km race, city run", "type": "exam", "due": "2026-12-10", "hours": 4, "done": false}
];

// Sharing the list. The browser finds it on window.sampleTasks; Node reads module.exports.
if (typeof module !== 'undefined') {
  module.exports = sampleTasks;
} else {
  window.sampleTasks = sampleTasks;
}
