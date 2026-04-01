.PHONY: help init-env db-up db-down db-status db-logs app app-h2 dev test

help:
	@echo "Available targets:"
	@echo "  make init-env   # Create .env from .env.example if missing"
	@echo "  make db-up      # Start local PostgreSQL container"
	@echo "  make db-down    # Stop and remove local PostgreSQL container"
	@echo "  make db-status  # Show PostgreSQL container status"
	@echo "  make db-logs    # Follow PostgreSQL logs"
	@echo "  make app        # Run backend with default local profile (PostgreSQL)"
	@echo "  make app-h2     # Run backend with in-memory H2 profile"
	@echo "  make dev        # Start DB, then run backend"
	@echo "  make test       # Run test suite"

init-env:
	@test -f .env || cp .env.example .env
	@echo ".env is ready"

db-up: init-env
	docker compose up -d postgres

db-down:
	docker compose down

db-status:
	docker compose ps

db-logs:
	docker compose logs -f postgres

app:
	./mvnw spring-boot:run

app-h2:
	./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

dev: db-up app

test:
	./mvnw test

