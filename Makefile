
#!/usr/bin/make

SHELL=/bin/bash

UID := $(shell id -u)
GID := $(shell id -g)
USER := $(shell id -u -n)
PWD := $(shell pwd)

export UID
export GID
export USER

.PHONY: up down docker-build composer composer-install composer-update npm npm-install npm-update npm-watch npm-dev npm-build install

up:
	env UID=${UID} GID=${GID} docker compose up -d

down:
	env UID=${UID} GID=${GID} docker compose down

docker-build:
	env UID=${UID} GID=${GID} docker compose --profile dev build

composer:
	docker run -it --rm --user ${UID}:${GID} -v ${PWD}:/app -w=/app leapcreate/composer /bin/bash

composer-install:
	docker run -it --rm --user ${UID}:${GID} -v ${PWD}:/app -w=/app leapcreate/composer install

composer-update:
	docker run -it --rm --user ${UID}:${GID} -v ${PWD}:/app -w=/app leapcreate/composer update

npm:
	docker run -it --rm --user ${UID}:${GID} -v ${PWD}:/app -w=/app/assets node:18 /bin/bash

npm-install:
	docker run -it --rm --user ${UID}:${GID} -v ${PWD}:/app -w=/app/assets node:18 npm install

npm-update:
	docker run -it --rm --user ${UID}:${GID} -v ${PWD}:/app -w=/app/assets node:18 npm update

npm-watch:
	docker run -it --rm -p 127.0.0.1:35729:35729 --user ${UID}:${GID} -v ${PWD}:/app -w=/app/assets node:18 npm run watch

npm-dev:
	docker run -it --rm --user ${UID}:${GID} -v ${PWD}:/app -w=/app/assets node:18 npm run dev

npm-build:
	docker run -it --rm --user ${UID}:${GID} -v ${PWD}:/app -w=/app/assets node:18 npm run build

install: docker-build composer-install npm-install npm-dev
