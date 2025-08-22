# Auth

A robust, secure, and scalable authentication service built with NestJS. This service provides user registration, authentication, authorization, and account management capabilities.

---

## Table of Contents

- [Features](#features)
- [Project setup](#project-setup)
- [Environment Variables](#environment-variables)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [API Endpoints](#api-endpoints)
- [Compile and run the project](#compile-and-run-the-project)
- [Run tests](#run-tests)
- [Deployment](#deployment)
- [Resources](#resources)
- [Support](#support)
- [Stay in touch](#stay-in-touch)
- [License](#license)



## Features

- User registration and account creation
- Login/logout functionality
- Session management
- Role-based access control (RBAC)
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


## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord channel](https://discord.gg/G7Qnnhy)
- [Official video courses](https://courses.nestjs.com/)
- [NestJS Mau (AWS deployment)](https://mau.nestjs.com)
- [NestJS Devtools](https://devtools.nestjs.com)
- [Enterprise support](https://enterprise.nestjs.com)
- [Jobs board](https://jobs.nestjs.com)
- [X (Twitter)](https://x.com/nestframework)
- [LinkedIn](https://linkedin.com/company/nestjs)


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
