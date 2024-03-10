# Required Changes

## `backend.env` file

You will need to change lines `1` and `3` to reflect your domain or local IP address on which this container will used.

```text
FRONTEND_URL=http://10.55.0.128:8080 <-edit

AUTH_COOKIE_DOMAIN=10.55.0.128 <- edit
```

Port number in cookie domain is not required. `AUTH_COOKIE_SECURE` needs to be false for non-https connections. If you are using https, you can set it to true.

#### Optional: Emails

If you want email alerts for things like password resets, or email verifications, you will need to set up a mail server by filling in the fields starting with `SMTP` in the file.

## `frontend.env` file

Edit the first line just like you did in the `backend.env` file.

```text
VITE_BACKEND_BASE_URL=http://10.55.0.128:8080 <-edit
```

## Other files

No changes are required in other files.
