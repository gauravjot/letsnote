# Users

All the users of the system are stored in the `user` table. Three more tables are related to the `user` table: `session`, `password_reset` and `verify`.

-   `session` table stores the user sessions.
-   `password_reset` table stores the password reset tokens.
-   `verify` table stores the email verification tokens.

## Endpoints

| Method | Endpoint                                  | Description                                                |
| ------ | ----------------------------------------- | ---------------------------------------------------------- |
| POST   | `api/user/register/`                      | Register new user                                          |
| POST   | `api/user/login/`                         | Login user                                                 |
| POST   | `api/user/password/forgot/`               | Send email to reset password                               |
| POST   | `api/user/password/reset/`                | Reset password with token from inside reset password email |
| GET    | `api/user/password/reset/health/<token>/` | Check if the reset password token is still valid           |
| GET    | `api/user/profile/`                       | Get user profile                                           |
| GET    | `api/user/sessions/`                      | Get user sessions                                          |
| POST   | `api/user/verifyemail/resend/`            | Resend email verification                                  |
| PUT    | `api/user/change/password/`               | Change user password                                       |
| PUT    | `api/user/change/name/`                   | Change user name                                           |
| PUT    | `api/user/change/email/`                  | Change user email                                          |
| PUT    | `api/user/session/close/`                 | Close user session                                         |
| PUT    | `api/user/delete/`                        | Delete user                                                |
| DELETE | `api/user/logout/`                        | Logout user                                                |

#### HTML Pages

`api/user/verifyemail/<emailtoken>/`: Verify email when user clicks on the verification link from inside the email.

## Email Templates

-   `emails.py` file contains function calls for sending emails.
-   `email_templates.py` file contains the email templates.

#### `email_templates.py`

The HTML in this file works with email clients and is tested with Gmail and Outlook. To create a new function, copy an existing function and make the required changes.

## Error Logging

Most of the errors that may occur have an error code that starts with `A`, for example, `A0001`. This is for easy debugging and finding the error in the code.
