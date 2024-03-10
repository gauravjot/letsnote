# pull official base image
FROM python:3-slim-bookworm

# install packages
RUN apt-get update && apt install -y python3-dev supervisor gcc
RUN pip install uwsgi

# set work directory
RUN mkdir -p /home/app/webapp
WORKDIR /home/app/webapp

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
COPY . /home/app/webapp
WORKDIR /home/app/webapp/backend
RUN pip install -r /home/app/webapp/backend/requirements.txt

# setup django server
RUN cp /home/app/webapp/deploy/backend.env /home/app/webapp/backend/.env
RUN cp /home/app/webapp/deploy/backend_settings.py /home/app/webapp/backend/backend/settings.py
RUN echo -e "\nSECRET_KEY=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 64; echo)" >> .env
RUN python manage.py migrate
RUN python manage.py makemigrations notes users
RUN python manage.py migrate

# generate encryption key
RUN python /home/app/webapp/backend/notes/generate_key.py

# Frontend and Nodejs
WORKDIR /home/app/webapp/frontend
RUN cp /home/app/webapp/deploy/frontend.env /home/app/webapp/frontend/.env
RUN apt-get update && apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y
RUN npm install
EXPOSE 4173
RUN npm run build

# Supervisor and uWSGI setup
RUN cp /home/app/webapp/deploy/supervisor.conf /etc/supervisor/conf.d
EXPOSE 8000
RUN service supervisor stop
CMD /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisor.conf