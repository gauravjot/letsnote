current_dir := $(dir $(abspath $(firstword $(MAKEFILE_LIST))))

.PHONY : clean build run reset br

build: clean
	docker build -t letsnote .

run:
	docker run --name letsnote -d -p 8080:80 letsnote

br:	build run

reset:
	docker stop letsnote
	docker rm letsnote
	docker run --name letsnote -d -p 8080:80 letsnote

clean:
	docker stop letsnote || true
	docker rm letsnote || true
	docker image rm letsnote || true

backup:
	mkdir backup
	docker cp letsnote:/home/app/webapp/db $(current_dir)backup
