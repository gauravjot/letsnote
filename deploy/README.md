# Docker Deployment

## Required Changes

### `backend.env` file

You will need to change lines `1` and `3` to reflect your domain or local IP address on which this container will used.

```text
FRONTEND_URL=http://your-host-machine-ip-address:8080

AUTH_COOKIE_DOMAIN=your-host-machines-ip-address
```

Port number for `AUTH_COOKIE_DOMAIN` is not required. `AUTH_COOKIE_SECURE` needs to be false for non-HTTPS connections.

If you are deploying this in production, you should:

-   Set `FRONTEND_URL` to your domain name.
-   Set `AUTH_COOKIE_DOMAIN` to your domain name.
-   Set `AUTH_COOKIE_SECURE` to `True`.
-   Set `SECURE_SSL_REDIRECT` to `True`.
-   Use a reverse proxy like Nginx to forward requests from your domain to the host machine.
-   Install an SSL certificate for your domain. Get free SSL certificates from [Let's Encrypt](https://letsencrypt.org/).

#### Optional: Emails

> Recommended for production.

If you want email alerts for things like password resets, or email verifications, you will need to set up a mail server by filling in the fields starting with `SMTP` in the file. Some features such as forgot password will not work without this.

### `frontend.env` file

Edit the first line just like you did in the `backend.env` file to the IP address of the host machine. The port number depends on what you expose the docker container's backend on. `Makefile` exposes it on port `8080` by default.

```text
VITE_BACKEND_BASE_URL=http://your-host-machine-ip-address:8080
```

For production:

-   Set this to your domain name instead.

## Running the Docker Containers

To build the image, run:

```bash
make build
```

Then to run the container:

```bash
make run
```

## Backups

### Creating Backups

The only folder that you may want to expose to the host machine is `db` folder. It contains the SQLite database file and the `key.bin` file used to encrypt notes.

However, rather than exposing the directory permanently, you may want to use cronjobs instead for doing periodic backups.

Use this to copy `db` folder to your host machine:

```bash
docker cp letsnote:/home/app/webapp/db /path/to/host/backup/folder
```

Here `letsnote` is the name of the running container.

### Restoring Backups

To restore the backup, copy the `db` folder back to the container:

```bash
docker cp /path/to/host/backup/folder/db letsnote:/home/app/webapp
```

Copy the `key.bin` file to `/home/app/webapp/backend/notes` directory.

```bash
docker exec letsnote cp /home/app/webapp/db/key.bin /home/app/webapp/backend/notes/key.bin
```

After that, please restart the container.
