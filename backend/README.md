# DevDash Backend - Local PostgreSQL Setup

## Quick start (automated)

Use the Makefile to avoid typing multiple commands each time.

```bash
cd /home/ermalmc/Programs/Coding/Project_Files/DevDash/backend
make dev
```

`make dev` will:
- create `.env` from `.env.example` if needed
- start PostgreSQL container
- run Spring Boot app

## Useful automation commands

```bash
cd /home/ermalmc/Programs/Coding/Project_Files/DevDash/backend
make help
make db-status
make db-logs
make test
make db-down
```

## Manual quick start

1. Create local environment file:

```bash
cd /home/ermalmc/Programs/Coding/Project_Files/DevDash/backend
cp .env.example .env
```

2. Start PostgreSQL:

```bash
cd /home/ermalmc/Programs/Coding/Project_Files/DevDash/backend
docker compose up -d postgres
```

3. Run the backend (uses `local` profile by default):

```bash
cd /home/ermalmc/Programs/Coding/Project_Files/DevDash/backend
./mvnw spring-boot:run
```

## Verify DB is healthy

```bash
cd /home/ermalmc/Programs/Coding/Project_Files/DevDash/backend
docker compose ps
docker compose logs -f postgres
```

## Run tests

Tests use isolated H2 config from `src/test/resources/application.properties`.

```bash
cd /home/ermalmc/Programs/Coding/Project_Files/DevDash/backend
./mvnw test
```

## Optional profiles

- `local` (default): PostgreSQL on `localhost:5432`
- `h2`: in-memory DB for quick standalone runs

Run with H2 profile:

```bash
cd /home/ermalmc/Programs/Coding/Project_Files/DevDash/backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

