.PHONY: up down logs ps test clean rebuild

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

test:
	curl -s http://localhost:3000/health
	curl -s http://localhost:3000/usuarios

clean:
	docker compose down -v

rebuild:
	docker compose down
	docker compose up -d --build