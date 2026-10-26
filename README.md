# FocusFlow — Study Planner

A responsive study-planning dashboard built with **HTML, CSS, and vanilla JavaScript**.

## Features
- Add tasks with High, Medium, or Low priority
- Mark tasks as complete and delete tasks
- Filter tasks by All, In progress, and Completed
- Clear completed tasks
- Pomodoro-style focus timer with 25, 15, and 5 minute presets
- Progress statistics that update automatically
- Light and dark theme toggle
- Responsive layout for desktop, tablet, and mobile
- Accessible labels and basic input escaping

## Run locally
1. Download or clone this repository.
2. Open `index.html` in your browser.

No build tools or dependencies are required. Google Fonts are loaded online; the app itself works without a backend.

## Publish with GitHub Pages
1. Create a new public repository on GitHub, for example `focusflow-study-planner`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then click **Save**.
6. Wait a few minutes and open the URL GitHub Pages provides.

## Project structure
```text
focusflow-study-planner/
├── index.html
├── style.css
├── script.js
└── README.md
```

## What I learned
- Responsive layouts with CSS Grid and Flexbox
- DOM selection and event delegation
- Managing application state in JavaScript
- Form validation and safe text rendering
- SVG progress rings and timer intervals
- Theme switching and accessible UI patterns
