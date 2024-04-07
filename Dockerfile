# pull official base image
FROM python:3-slim-bookworm

# install packages
RUN apt-get update && apt install -y python3-dev supervisor gcc nginx curl lsof nano
RUN pip install uwsgi

# set work directory
RUN mkdir -p /home/app/webapp
WORKDIR /home/app/webapp

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# copy files
COPY . /home/app/webapp

# nginx setup
RUN cp /home/app/webapp/deploy/nginx.conf /etc/nginx/sites-enabled/default

# install python packages
WORKDIR /home/app/webapp/backend
RUN pip install -r /home/app/webapp/backend/requirements.txt

# setup django server
RUN cp /home/app/webapp/deploy/backend.env /home/app/webapp/backend/.env
RUN echo "\nSECRET_KEY=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 64; echo)" >> .env
RUN cat .env
RUN python manage.py makemigrations notes users
RUN python manage.py migrate

# generate encryption key
RUN python /home/app/webapp/backend/notes/generate_key.py
RUN cp /home/app/webapp/backend/notes/key.bin /home/app/webapp/db/key.bin

# Frontend and Nodejs
WORKDIR /home/app/webapp/frontend
RUN cp /home/app/webapp/deploy/frontend.env /home/app/webapp/frontend/.env
RUN apt-get update && apt-get install -y ca-certificates gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y
RUN npm install
RUN npm run build
RUN apt-get purge nodejs gnupg ca-certificates -y
RUN apt autoremove

# Supervisor and uWSGI setup
WORKDIR /var/log/supervisor
RUN cp /home/app/webapp/deploy/supervisor.conf /etc/supervisor/conf.d
EXPOSE 80
RUN service supervisor stop
RUN service nginx stop
CMD /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisor.conf