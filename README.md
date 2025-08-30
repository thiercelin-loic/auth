# Auth

A robust, secure, and scalable authentication service built with NestJS. This service provides user registration, authentication, authorization, and account management capabilities.

---

## Table of Contents

- [Auth](#auth)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Project setup](#project-setup)
  - [Environment Variables](#environment-variables)
  - [API Documentation (Swagger)](#api-documentation-swagger)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth-1)
    - [Users](#users)
    - [Sessions](#sessions)
    - [Roles \& RBAC](#roles--rbac)
  - [Security Notes](#security-notes)
  - [Compile and run the project](#compile-and-run-the-project)
  - [Run tests](#run-tests)
  - [Deployment](#deployment)
  - [Database Tables \& Schemas](#database-tables--schemas)
  - [Resources](#resources)
  - [Support](#support)
  - [License](#license)



## Features

- User registration and account creation
- Login/logout functionality
- Secure JWT and refresh token management (with httpOnly cookies)
- Session management
- Password reset and email verification flows
- Role-based access control (RBAC)
- Strong password enforcement
- JWT token issuance and validation
- User profile management



## Project setup

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd auth
npm install
```


## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=your_db_user
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=your_db_name
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

Adjust values as needed for your environment.

---

## API Documentation (Swagger)

This project uses [Swagger](https://swagger.io/) for interactive API documentation. Once the server is running, access the docs at:

```
http://localhost:3000/api
```

You can explore all endpoints, view request/response schemas, and test API calls directly from the Swagger UI.

---


## API Endpoints

Below is a summary of the main endpoints. For full details, see the Swagger UI.

### Auth

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT
- `POST /auth/logout` — Logout user (requires JWT and refresh token cookie)
- `POST /auth/refresh-token` — Get new access token using refresh token (cookie)
- `POST /auth/forgot-password` — Request password reset email
- `POST /auth/reset-password` — Reset password with token (strong password required)
- `POST /auth/verify-email` — Verify email with token

### Users

- `GET /users/me` — Get current user profile (JWT required)
- `PUT /users/me` — Update user profile (JWT required)
- `POST /users/mfa/enable` — Enable multi-factor authentication (not implemented)
- `POST /users/mfa/verify` — Verify multi-factor authentication (not implemented)
- `POST /users/mfa/disable` — Disable multi-factor authentication (not implemented)

### Sessions

- `GET /users/sessions` — List active sessions
- `DELETE /users/sessions/:id` — Invalidate a session


### Roles & RBAC

- Protected endpoints require appropriate roles (e.g., `GET /users` requires `admin` role).

---

## Security Notes

- All sensitive endpoints require JWT authentication.
- Refresh tokens are stored in httpOnly cookies for security.
- Passwords must be strong (min 8 chars, upper/lowercase, number/special char).
- Email verification and password reset flows use signed JWT tokens.
- Defensive checks are in place for malformed or missing tokens.


## Compile and run the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```


## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```


## Deployment

When you're ready to deploy your NestJS application to production, check out the [deployment documentation](https://docs.nestjs.com/deployment) for best practices.

You can also use [Mau](https://mau.nestjs.com) for cloud deployment on AWS:

```bash
npm install -g @nestjs/mau
mau deploy
```

## Database Tables & Schemas

The following tables are created by this service (using TypeORM):

- **users**
	- `id` (PK, UUID): Unique user identifier
	- `email` (unique): User email address
	- `password_hash`: Hashed password
	- `first_name`, `last_name`: User names
	- `roles`: Array of user roles (e.g., user, admin)
	- `is_verified`: Email verified flag
	- `email_verified`: Email verified flag (used in flows)
	- `mfa_enabled`, `mfa_secret`: Multi-factor authentication fields
	- `refresh_token`: Stores the current refresh token (for session management)
	- `created_at`, `updated_at`, `last_login`: Timestamps

- **sessions**
	- `id` (PK, UUID): Unique session identifier
	- `user_id` (FK): References `users.id`
	- `token_hash`: Hashed session token
	- `ip_address`, `user_agent`: Session metadata
	- `expires_at`, `created_at`: Timestamps

**Key Relationships:**
- Each user can have multiple sessions (`users.id` → `sessions.user_id`)
- Roles are stored as a simple array in the `users` table
- MFA and refresh token fields are per-user (not per-session)

> Note: If you use migrations or change the entity files, your schema may differ. See the `src/validators/*.entity.ts` files for details.
>
> ## Architecture: DTOs, Controllers, and Services

This project follows the standard NestJS architecture, which separates concerns as follows:

- **DTOs (Data Transfer Objects):**
  - Define the shape and validation rules for incoming data (e.g., registration, login, password reset).
  - Use class-validator decorators (like `@IsEmail`, `@MinLength`) to enforce data integrity before it reaches your business logic.
  - Example: `RegisterDto`, `ResetPasswordDto`, etc.

- **Controllers:**
  - Define the API endpoints (routes) and handle HTTP requests/responses.
  - Receive validated data (DTOs) from the client and delegate processing to services.
  - Example: `AuthController` exposes `/auth/register`, `/auth/login`, etc.

- **Services:**
  - Contain the business logic for each feature (e.g., user registration, authentication, session management).
  - Interact with the database, handle security, and implement core workflows.
  - Controllers call services to perform actions and return results to the client.

**Flow Example:**
1. A client sends a POST request to `/auth/register` with registration data.
2. The controller receives the request and applies the `RegisterDto` for validation.
3. If validation passes, the controller calls the `AuthService.register()` method.
4. The service handles user creation, password hashing, and database interaction.
5. The result is returned to the controller, which sends the response to the client.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
