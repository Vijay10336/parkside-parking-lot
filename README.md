# Parkside — parking lot

A small Java 17 / Spring Boot API with a React dashboard for a 10-space parking lot. It assigns the first free slot and charges 20 units for each started hour, with a one-hour minimum. Data lives in memory and resets on restart.

Open `http://localhost:8080` for the dashboard.

## Run

Build the UI first, then start the API:

```sh
cd frontend
npm install
npm run build
cd ..
mvn spring-boot:run
```

Or build and run with Docker:

```sh
docker build -t parking-lot .
docker run --rm -p 8080:8080 parking-lot
```

## Try it

```sh
curl -X POST localhost:8080/api/parking/enter -H 'Content-Type: application/json' -d '{"plate":"HR12AB1234"}'
curl localhost:8080/api/parking/availability
curl localhost:8080/api/parking/vehicles
curl -X POST localhost:8080/api/parking/exit -H 'Content-Type: application/json' -d '{"plate":"HR12AB1234"}'
```

`enter` returns a slot and arrival time. `exit` returns the fee. Invalid requests return HTTP 400 with an `error` message. Run tests with `mvn test`.

## Project layout

- `frontend/src/main.jsx`: dashboard and parking interactions
- `frontend/src/api.js`: HTTP calls, kept separate for future screens
- `src/main/java/.../ParkingController.java`: REST endpoints
- `src/main/java/.../ParkingService.java`: slot and fee rules
- `src/test`: rule tests

For development, run `mvn spring-boot:run` in the root and `npm run dev` in `frontend`; Vite serves the UI at `http://localhost:5173` and forwards API calls to port 8080.

## Interface design

The app uses a custom Material UI theme, locally bundled Inter typography, clearer controls, and responsive layouts. See the [design notes and palette](docs/DESIGN.md).
