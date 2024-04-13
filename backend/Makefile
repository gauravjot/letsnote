# Only to be used in development environment

apps := users notes

.PHONY: all

venv:
	rm -rf .venv
	python3 -m venv .venv
	.venv/bin/python -m pip install -r requirements.txt

resetdb:
	rm -f ../db/db.sqlite3
	find . -type d -name migrations -prune -not -path "./.venv/*" -exec rm -rf {} \;
	.venv/bin/python manage.py makemigrations $(apps)
	.venv/bin/python manage.py migrate

run:
	.venv/bin/python manage.py runserver 0.0.0.0:8000