.PHONY : clean build run

build: clean
	docker image rm letsnote || true
	docker build --progress=plain -t letsnote .

run:
	docker run --name letsnote -d -p 4173:4173 -p 8000:8000 letsnote

clean:
	docker stop letsnote || true
	docker rm letsnote || true
	docker image rm letsnote || true
