# Run Parkside, step by step

## Docker (easiest)

1. Install Docker Desktop and start it.
2. Open Terminal in this `parking-lot` folder.
3. Build the image: `docker build -t parking-lot:local .`
4. Start the app: `docker run --rm --name parking-lot -p 8080:8080 parking-lot:local`
5. Open `http://localhost:8080`.
6. Enter a plate and select **Park vehicle**. The dashboard assigns a free space.
7. Select **Check out** on that vehicle. The fee appears above the list.
8. Stop with Ctrl+C. In-memory parking records reset when the container stops.

If port 8080 is busy, use `-p 18080:8080` and open `http://localhost:18080` instead.

## Quick API check

In a second Terminal window:

```sh
curl http://localhost:8080/api/parking/availability
curl -X POST http://localhost:8080/api/parking/enter -H 'Content-Type: application/json' -d '{"plate":"HR12AB1234"}'
curl http://localhost:8080/api/parking/vehicles
curl -X POST http://localhost:8080/api/parking/exit -H 'Content-Type: application/json' -d '{"plate":"HR12AB1234"}'
```

The first response should show `freeSlots: 10`. Entry returns slot 1, the vehicle list shows the plate, and exit returns a fee of 20 units for a short stay.

Verified in Docker on 15 November 2026: the dashboard returned HTTP 200; availability returned 10; entry assigned slot 1; the vehicle appeared in the list; exit returned a fee of 20.

## Without Docker

Install Java 17, Maven, and Node 22. From `frontend`, run `npm install` and `npm run build`. Return to this folder and run `mvn spring-boot:run`. Open `http://localhost:8080`.

## Checks and deployment

Run `mvn test` for the parking rules. `docker build` packages the React production build into the Spring Boot JAR. Any host that runs Docker can deploy the image with `-p 8080:8080`; set the host's public route or reverse proxy to port 8080. This demo has no database or login, so use it as a portfolio sample, not a public parking operation with real records.
