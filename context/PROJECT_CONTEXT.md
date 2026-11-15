# Parkside project context

This is a working summary of the conversation that started this app. It is not a verbatim chat export.

## What Vijay asked for

- Build small portfolio applications, starting with parking management, and push the code to GitHub.
- Use a normal, simple project structure and clear, human-readable code.
- Include documentation, deployment steps, and a step-by-step guide based on running the app in Docker.
- Add a React interface with a polished design.
- Keep the structure easy to extend with future features.
- Keep explanations concise.

## Current app

- GitHub: https://github.com/Vijay10336/parkside-parking-lot
- Local project: `apps/parking-lot` in the Codex workspace.
- Java 17, Spring Boot 3.4.2, React 19, Vite 6, Docker.
- A ten-space lot assigns the lowest free slot. Plates are trimmed and case-normalized.
- Entry, exit, vehicle list, and availability are exposed through `/api/parking`.
- Exit costs 20 abstract units per started hour, with a one-hour minimum.
- The React dashboard shows availability, occupancy, a space map, parked vehicles, search, entry, and checkout.
- Parking records are in memory and disappear when the app restarts.

## Files to change

- Backend rules: `src/main/java/dev/vijay/parking/ParkingService.java`
- HTTP endpoints: `src/main/java/dev/vijay/parking/ParkingController.java`
- React screen: `frontend/src/main.jsx`
- HTTP client: `frontend/src/api.js`
- Visual styles: `frontend/src/style.css`
- Docker image: `Dockerfile`
- Run and deployment instructions: `RUNBOOK.md`

## Verified state on 15 November 2026

- `mvn -q -o test` passed.
- `npm run build` passed.
- Docker image `parking-lot:local` built and ran on port 18080.
- Browser dashboard returned HTTP 200 and displayed the empty lot correctly.
- API check: 10 free spaces; entry assigned slot 1; vehicle appeared in the list; exit returned a fee of 20.
- The project was pushed to GitHub `main` at commit `f54a874` before this context file was added.

## How to continue

1. Read `README.md` and `RUNBOOK.md`.
2. Make one focused feature change at a time. Keep parking rules in the service, HTTP handling in the controller, and UI calls in `frontend/src/api.js`.
3. Run `mvn test` and `npm run build`.
4. Build and run with Docker using the runbook, then test the feature in the browser.
5. Commit and push the change to the GitHub repository.

Possible next features, only when requested: configurable capacity and hourly rate, a history of completed stays, persistent storage, and an admin login. Persistence and authentication would be needed before using this for real parking operations.
