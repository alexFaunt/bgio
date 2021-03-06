.PHONY: init up reboot down

NETWORK_IP := $(shell ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | tail -1)

init: down
	yarn install --frozen-lockfile
	docker-compose pull
	docker-compose build

up:
	docker-compose pull
	NETWORK_IP=${NETWORK_IP} yarn start:dev

down:
	docker-compose down

clean:
	docker image prune --force --filter "until=24h"
	docker volume prune --force --filter "until=24h"

reboot: init up

up-server:
	NETWORK_IP=${NETWORK_IP} docker-compose up

migrate:
	docker-compose exec server yarn migrate:dev

rollback:
	docker-compose exec server yarn rollback:dev
