[![Letsnote.io](press/logo/logo_simple.png)](https://letsnote.io)

🖱 <https://letsnote.io>

A rich text note-writing application. Letsnote's engine automatically saves notes and lets users share them with others.

_Demo acc: `test@letsnote.io`
Password: `@lphaT3sting`_

### Sections

-   [Features](#features)
-   [Gallery](#gallery)
-   [Technologies](#technologies)
-   [Installation](#installation)
-   [Building with Docker on Linux](#building-with-docker-on-linux)
-   [Contributing](#contributing)
-   [License](#license)

## Features

1. **Rich Text Editor** - Letsnote uses `Slate.js` to provide a rich text editor for note writing.
2. **Encrypted Storage** - Notes are stored in an encrypted format in the database.
3. **Sharing** - Users can share notes with others by generating a unique link.
4. **Cross-Device** - Users can create an account to manage their notes from any device. [WIP: Forgot password, and email verification]
5. **Auto Save** - Notes are automatically saved as the user types. (2 seconds delay to prevent spamming the server)

## Gallery

Landing page
![Letsnote.io](press/screenshots/shot_1.webp)

---

Share note interface
![Letsnote.io](press/screenshots/shot_3.webp)

---

Share page
![Letsnote.io](press/screenshots/shot_4.webp)

---

Account Management
![Letsnote.io](press/screenshots/shot_2.webp)

## Technologies

Current Letsnote Version in Production: `v0.3.0`

| Stack    | Tech               |
| -------- | ------------------ |
| Backend  | `Django`           |
| Python   | `3.10.12`          |
| Database | `PostgreSQL 16`    |
| Frontend | `React.js`         |
| Editor   | `Slatejs v0.102.0` |

## Installation

1. Clone the repository

    ```bash
    git clone https://github.com/gauravjot/letsnote.git
    ```

2. Set up a virtual environment and activate it.

    ```bash
    cd ./backend
    python3 -m venv venv
    ```

    Linux/MacOS

    ```bash
    source venv/bin/activate
    ```

    Windows

    ```bash
    .\venv\Scripts\activate
    ```

    Install the required packages

    ```bash
    pip install -r requirements.txt
    ```

3. Set environment variables for Django. Rename `sample.env` to `.env` and fill in the required fields.
4. Go to `backend/notes` and run `python generate_key.py` to generate an encryption key for notes.
5. Run database migrations

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

    If you encounter any issues, please refer to the [Django Documentation](https://docs.djangoproject.com/en/3.2/topics/migrations/).

6. **For Production**: Set up a Django production environment. Follow this guide - [Deploy Django REST APIs on Ubuntu Server with uWSGI](https://gauravjot.com/blog/deploy_django_api_with_uwsgi_on_ubuntu).

    **For Development**: Run the Django server

    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```

7. Go to the `frontend` directory and install the required packages

    ```bash
    npm install
    ```

8. Set environment variables for the front-end. Rename `sample.env` to `.env` and update fields as required.
9. **For Production**: Build the frontend

    ```bash
    npm run build
    ```

    **For Development**: Run the frontend server

    ```bash
    npm run dev
    ```

## Building with Docker on Linux

1. Clone the repository.
2. Go to the `deploy` directory. Read the `README.md` file for more information and make the required changes.
3. In the root directory of this project, run the makefile.

    ```bash
    make build
    ```

    This will build the docker image for the project and the application will be available through port 80 of the image.

4. Run the docker container.

    ```bash
    make run
    ```

    This will run the container and the application will be available on port 8080 of the host machine.

## Contributing

There are several ways you can contribute to this project:

1. Code Contributions: You can help us by writing code, fixing bugs, and implementing new features. Check out the Issues section for tasks that need attention or suggest improvements.

2. Bug Reports: If you encounter a bug while using Letsnote, please report it in the Issues section. Be sure to include relevant details that can help us reproduce the issue.

3. Feature Requests: Have an idea for a new feature? Share it with us in the Issues section. We encourage discussions around potential enhancements to the project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details.
