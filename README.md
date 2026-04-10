# REST API & GraphQL — Node.js Course Project

A backend application built as part of the course [NodeJS - The Complete Guide](https://www.udemy.com/course/nodejs-the-complete-guide/) by Maximilian Schwarzmüller. Deprecated methods have been replaced with modern alternatives.

## Features

- User authentication (register & login via JWT)
- CRUD for posts (create, read, update, delete)
- Image uploads via Multer
- Real-time updates via WebSockets (Socket.io)
- GraphQL API with custom schema and resolvers
- Pagination
- Automated tests (Vitest)

## Endpoints (REST)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/signup` | Create a new user |
| POST | `/auth/login` | Login & receive JWT |
| GET | `/auth/status` | Get user status |
| PATCH | `/auth/status` | Update user status |
| GET | `/feed/posts` | Get all posts (paginated) |
| POST | `/feed/post` | Create a post |
| GET | `/feed/post/:id` | Get a single post |
| PUT | `/feed/post/:id` | Update a post |
| DELETE | `/feed/post/:id` | Delete a post |
| PUT | `/post-image` | Upload an image |

## GraphQL

GraphQL playground available at `/graphiql`

Supported queries & mutations: `login`, `posts`, `post`, `user`, `createUser`, `createPost`, `updatePost`, `deletePost`, `updateStatus`

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT & bcryptjs
- Socket.io
- GraphQL (graphql-http)
- Multer
- Vitest (tests)
- dotenv
