# HW2 — NQU Student Portal

現代軟體工程 / Modern Software Engineering

林小蓮 111210552 資工四

A responsive student portal built with HTML, CSS, and vanilla JavaScript.
This is a classroom demonstration, not the official NQU academic system.

## Run
Open `index.html` in a browser, or use VS Code Live Server. No installation or build required.

Demo login: **111210552 / 123456**. Do not use a real university password.

## Features
- Dashboard with enrolled credits and today's classes
- Student profile
- Course search and day/status filters
- Add/drop courses with timetable conflict detection and a 25-credit demo limit
- Persistent enrollment using localStorage
- Weekly timetable and print layout
- Current-semester grades marked 尚未公布
- Responsive desktop/mobile layout

Four initial courses use the student-provided codes, names, credits, and periods (11 credits). Teacher and room details were not verified and are omitted or marked pending. Additional DEMO courses are explicitly illustrative. The credit limit is a demonstration rule, not an assertion about university policy. No invented grades or GPA.

## GitHub Pages
The URL :
`https://julianalidya.github.io/_se/HW2/`

## Project structure
- `index.html`: application entry
- `css/style.css`: layout, responsive styling, print styles
- `js/data.js`: profile and course data
- `js/app.js`: navigation, demo login, filtering, registration, timetable

All paths are relative, so this works inside a GitHub Pages subfolder. A Google font is optional; system fonts are used offline. Demo login only controls the interface and is not secure authentication. Enrollment changes are local to each browser, do not sync, and never affect actual university registration. To reset, clear the browser localStorage key `nqu-hw2-courses`.
