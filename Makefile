SHELL := /bin/bash
export

default:
	@echo "Makefile"
	@echo
	@echo "Following commands are available:"
	@echo
	@echo " - clean              : remove build files"
	@echo " - build              : build project"
	@echo " - install            : install dependencies"
	@echo " - test               : run unit tests"
	@echo " - dev                : run prject in dev mode"
	@echo " - dkr-build          : build docker image"
	@echo " - dkr-run            : run docker image"





.PHONY: test
.ONESHELL:
MAKEFLAGS += --no-print-directory


clean:
	npm run clean

dev:
	npm run dev

build:
	npm run build

install:
	npm install --legacy-peer-dep

dkr-build: 
	docker build -t testapinode .

dkr-run:
	docker run --network host -p 3000:3000 testapinode  
test:
	clear
	make build
	npm run test