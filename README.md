# Welcome to `fixflex` 🛠️

## What is fixflex?

**Fixflex** is a platform that connects people who need tasks done with individuals who are willing to complete those tasks for pay. It operates like traditional freelancing platforms such as _Upwork_, _Fiverr_, and _Freelancer_, where users can post tasks or jobs and taskers make offers on these tasks. The user then selects the most suitable tasker for the job. However, the main difference between **fixflex** and traditional freelancing platforms lies in their primary objectives. While platforms like _Upwork_ primarily focus on digital services such as programming, writing, and design, **fixflex**'s core mission is to facilitate the completion of a wide range of everyday tasks and services. **Fixflex** specializes in connecting people who need tasks like plumbing, electricity, painting, cleaning, gardening, moving, cooking, and more with handymen who are willing to perform these tasks for pay.

# Tech Stack (main) 📚

- [x] `Node.js`: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [x] `TypeScript`: A superset of JavaScript that adds static types to the language.
- [x] `Express.js`: A minimalist web framework for Node.js, used to build APIs and web apps.
- [x] `MongoDB`: A NoSQL database system known for its flexibility and scalability.
- [x] `Mongoose`: An Object Data Modeling (ODM) library for MongoDB.

# Deployment Stack (CI/CD) 🚀

The backend of `fixflex` is deployed using the following technologies:

- `Render`: A cloud platform for deploying and scaling web applications, providing simplicity and scalability.
- `GitHub Actions`: Automated workflows triggered by GitHub events, used for continuous integration and continuous deployment (CI/CD) pipelines.
- `Docker`: Containerization platform used to package the backend of `fixflex` and its dependencies into a lightweight, portable container.

# Features 📌

## Core Features 🌟

- [x] `User Authentication`: Authenticates users using JWT (JSON Web Tokens)
- [x] `Role-Based Access Control`: Implements role-based access control to restrict user access to specific resources based on their roles and permissions.
- [x] `User Management`: Allows users to register, log in, log out, and manage their profiles.
- [x] `Task Management`: Enables users to post tasks, view tasks, make offers, and select taskers for their tasks.
- [x] `Task Status Tracking`: Enables users and taskers to track the status of tasks, from posting to completion, providing transparency and accountability.
- [x] `Task Categories`: Organizes tasks into categories and subcategories for easy navigation and browsing, catering to diverse user needs.
- [x] `Tasker Management`: Enables taskers to accept or reject offers, view their tasks, and complete tasks.
- [x] `Offer Management`: Allows taskers to make offers on tasks and users to accept or reject these offers.
- [x] `Tasker Verification`: Verifies taskers' identities,to ensure trust and safety for users.
- [x] `Tasker Availability`: Allows taskers to set their availability, working hours, and service areas to manage their schedules effectively.
- [x] `Tasker Earnings`: Tracks taskers' earnings, payments, and financial transactions to provide transparency and facilitate financial management.
- [x] `Rating and Review System`: Allows users to rate and review taskers based on their performance, enhancing trust and transparency.
- [x] `Payment Gateway Integration`: Integrate with paymob for secure online payments between users and taskers.
- [x] `Search and Filter`: Allows users to search for tasks based on keywords, categories, locations, and other criteria, enhancing task discovery.
- [x] `Location-Based Services`: Utilizes geolocation services to display tasks and taskers based on the user's location, providing a personalized experience.
- [x] `Real-Time Chat`: Enables direct communication between users and taskers to discuss task details, negotiate terms, and provide updates.

## Additional Features 🌟

- [x] `Multi-Language Support`: Supports multiple languages and locales to cater to a diverse user base, providing a localized experience.
- [x] `Email Notifications`: Sends automated email notifications to users and taskers for account verification, password reset, task updates, and other events.
- [x] `Push Notifications`: Sends push notifications using OneSignal to users and taskers for task updates, messages, reminders, and other relevant events.
- [x] `Webhooks`: Enables the integration of external service by providing webhook endpoints for event-driven communication.
- [x] `Testing Suite`: Includes a comprehensive testing suite comprising unit tests, integration tests to ensure code reliability and maintainability.
- [x] `Continuous Integration/Deployment (CI/CD)`: Integrates automated testing and deployment processes to streamline development workflows using GitHub Actions.
- [x] `Localization and Internationalization`: Supports multiple languages (ar & en) and locales to cater to a diverse user base, providing a localized experience.
- [x] `WebSockets`: Implements real-time communication between clients and the server using WebSockets, enabling interactive features such as live chat or notifications.
- [x] `CRUD Operations`: Implements Create, Read, Update, and Delete operations for all resources using RESTful API design.
- [x] `API Versioning`: Organizes API endpoints into versions for better management, with the current version being `v1`.
- [x] `Geolocation Services`: Integrates geolocation services to provide location-based functionalities such as finding nearby service providers.

### Code Features 🌟

- [x] `TypeScript`: Utilizes TypeScript to add static types to JavaScript, improving code quality, and catching errors early in the development process.
- [x] `RESTful API Design`: Adheres to RESTful API design principles to create a standardized and predictable API interface for clients to interact with.
- [x] `Modular Architecture`: Organizes code into classes, and functions to improve code readability, and maintainability using the MVC and DAO (Data Access Object) pattern.
- [x] `Dependency Injection`: Implements dependency injection using tsyringe package to manage component dependencies and improve code maintainability, flexibility.
- [x] `Code Linting`: Enforces code style and quality standards using prettier.
- [x] `Code Testing`: Implements unit tests, integration tests using Jest and supertest to validate code functionality, identify bugs, and ensure code reliability.
- [x] `API Documentation`: Provides comprehensive documentation for APIs using tools like Swagger and postman to facilitate code maintenance and collaboration.
- [x] `Code Version Control`: Utilizes version control systems such as Git to track code changes.
- [x] `Environment Configuration`: Utilizes environment variables to manage configuration settings and sensitive information, ensuring security and flexibility.
- [x] `Best Practices & Clean Code`: Follows industry-standard design principles as possible including SOLID, DRY (Don't Repeat Yourself), and KISS (Keep It Simple, Stupid).

### Security Features 🌟

- [x] `Logging and Monitoring`: Includes logging functionality to track application behavior and performance using Winston and Morgan.
- [x] `Input Validation`: Validates user input to prevent common security vulnerabilities such MongoDB injection, cross-site scripting (XSS).
- [x] `Security Headers`: Uses Helmet to set secure HTTP headers to protect against common web vulnerabilities.
- [x] `Rate Limiting`: Implements rate limiting to prevent abuse of the API by limiting the number of requests a user can make within a certain time period.
- [x] `HTTPS`: Enforces HTTPS to encrypt data in transit and protect against.
- [x] `CORs`: Configures Cross-Origin Resource Sharing (CORS) to restrict access to resources from different origins, preventing cross-site request forgery (CSRF) attacks.
- [x] `JWT Authentication`: Implements JSON Web Token (JWT) authentication to secure API endpoints and authenticate users.
- [x] `Password Hashing`: Hashes user passwords using strong cryptographic algorithms such as bcrypt to protect user credentials from unauthorized access.
- [x] `OAuth 2.0`: Integrate with google OAuth 2.0 for secure authentication and authorization, allowing users to sign in using their Google accounts.
- [x] `Error Handling`: Implements error handling mechanisms to catch and handle exceptions gracefully, providing informative error messages to users.

### Future Features 🚀

- [ ] `Machine Learning Integration`: Integrates machine learning models to provide personalized recommendations, predictive analytics, or automated decision-making capabilities within the application.
- [ ] `Task Recommendations`: Provides personalized task recommendations based on user preferences, history, and behavior, enhancing user engagement.
- [ ] `Caching Mechanisms`: Utilizes caching mechanisms to improve performance and reduce database load, enhancing overall system efficiency.
- [ ] `Tasker Matching Algorithm`: Develops a tasker matching algorithm to recommend the most suitable taskers for specific tasks based on skills, ratings, and availability.
- [ ] `Tasker Performance Metrics`: Provides taskers with performance metrics, analytics, and insights to help them improve their services and grow their businesses.
- [ ] `Third-Party API Integration`: Integrates third-party APIs such as Twilio, or Mailgun to enhance functionality and provide additional features.

# API Documentation 📖

The API documentation for `fixflex` is available using Swagger UI. You can access the API documentation by visiting the following URL:
https://server.fixflex.tech/api-docs

For postman collection visit:
https://documenter.getpostman.com/view/24552265/2sA2r53QzT#intro

## Endpoints

### Admin

- Category
  - [x] `GET /categories`: Get all categories
  - [x] `GET /categories/:id`: Get a category by id
  - [x] `POST /categories`: Create a new category
  - [x] `PUT /categories/:id`: Update a category
  - [x] `DELETE /categories/:id`: Delete a category
- Coupon
  - [x] `GET /coupons`: Get all coupons
  - [x] `GET /coupons/:id`: Get a coupon by id
  - [x] `POST /coupons`: Create a new coupon
  - [x] `PUT /coupons/:id`: Update a coupon
  - [x] `DELETE /coupons/:id`: Delete a coupon
- Task
  - [x] `GET /tasks`: Get all tasks
  - [x] `GET /tasks/:id`: Get a task by id
  - [x] `POST /tasks`: Create a new task
  - [x] `PUT /tasks/:id`: Update a task
  - [x] `DELETE /tasks/:id`: Delete a task
- Tasker
  - [x] `GET /taskers`: Get all taskers
  - [x] `GET /taskers/:id`: Get a tasker by id
  - [x] `POST /taskers`: Create a new tasker
  - [x] `PUT /taskers/:id`: Update a tasker
  - [x] `DELETE /taskers/:id`: Delete a tasker
- User
  - [x] `GET /users`: Get all users
  - [x] `GET /users/:id`: Get a user by id
  - [x] `POST /users`: Create a new user
  - [x] `PUT /users/:id`: Update a user
  - [x] `DELETE /users/:id`: Delete a user
- Review
  - [x] `GET /reviews`: Get all reviews
  - [x] `GET /reviews/:id`: Get a review by id
  - [x] `POST /reviews`: Create a new review
  - [x] `PUT /reviews/:id`: Update a review
  - [x] `DELETE /reviews/:id`: Delete a review
- Offer
  - [x] `GET /offers`: Get all offers
  - [x] `GET /offers/:id`: Get an offer by id
  - [x] `POST /offers`: Create a new offer
  - [x] `PUT /offers/:id`: Update an offer
  - [x] `DELETE /offers/:id`: Delete an offer

### Auth

- [x] `POST /auth/signup`: Register a new user
- [x] `POST /auth/login`: Login a user
- [x] `POST /auth/logout`: Logout a user
- [x] `POST /auth/google`: Login with google
- [x] `GET /auth/refresh-token`: Refresh access token
- [x] `POST /auth/forgot-password`: Forgot password
- [x] `POST /auth/verify-reset-code`: Verify reset code
- [x] `PATCH /auth/reset-password`: Reset password
- [x] `PATCH /auth/change-password`: Change user password

### User

- [x] `GET /users/me`: Get current user profile
- [x] `GET /users/:id`: Get a user by id
- [x] `PATCH /users/me`: Update current user profile
- [x] `PATCH /users/me/profile-picture`: Update user profile picture
- [x] `POST /users/me/send-verification-code`: Verify user phone number
- [x] `POST /users/me/verify-phone-number`: Verify user phone number

### Tasker

- [x] `POST /taskers/become-tasker`: Apply to become a tasker
- [x] `GET /taskers`: Get list of taskers
- [x] `GET /taskers/:id`: Get a tasker by id
- [x] `GET /taskers/me`: Get current tasker profile
- [x] `PATCH /taskers/me`: Update current tasker profile
- [x] `POST /taskers/apply-coupon`: Apply coupon to tasker account
- [x] `POST /taskers/commision-pay`: Pay tasker commision

### Category

- [x] `GET /categories`: Get list of categories
- [x] `GET /categories/:id`: Get a category by id

### Task

- [x] `POST /tasks`: Create a new task
- [x] `GET /tasks`: Get list of tasks
- [x] `GET /tasks/:id`: Get a task by id
- [x] `PATCH /tasks/:id/images`: Update a task images
- [x] `PATCH /tasks/:id`: Update a task
- [x] `PATCH /tasks/:id/open`: Open a task
- [x] `PATCH /tasks/:id/complete`: Complete a task
- [x] `PATCH /tasks/:id/cancel`: Cancel a task
- [x] `PATCH /tasks/:id/checkout`: Checkout a task

### Review

- [x] `POST /reviews`: Create a new review
- [x] `GET /reviews`: Get list of reviews
- [x] `GET /reviews/:id`: Get a review by id
- [x] `PATCH /reviews/:id`: Update a review
- [x] `DELETE /reviews/:id`: Delete a review

### Task/Review

- [x] `GET /tasks/:id/reviews`: Get list of reviews for a task
- [x] `GET /tasks/:id/reviews/:id`: Get a review for a task
- [x] `POST /tasks/:id/reviews`: Create a review for a task

### Offer

- [x] `POST /offers`: Create a new offer
- [x] `GET /offers`: Get list of offers
- [x] `GET /offers/:id`: Get an offer by id
- [x] `PATCH /offers/:id`: Update an offer
- [x] `DELETE /offers/:id`: Delete an offer
- [x] `PATCH /offers/:id/accept`: Accept an offer

### Chat

- [x] `POST /chats`: Create a new chat
- [x] `GET /chats`: Get list of chats
- [x] `GET /chats/:id`: Get a chat by id

### Message

- [x] `POST /messages`: Create a new message
- [x] `GET /messages/chat/:id`: Get list of messages for a chat
- [x] `DELETE /messages/:id`: Delete a message

### Document

- [x] `GET /api-docs`: Get swagger documentation

### healthz

- [x] `GET /healthz`: Health check endpoint
- [x] `GET /`: Health check endpoint

# Project Structure 📁

```
fixflex/
├── src/
│   ├── config/
│   │   ├── validateEnv.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── category.controller.ts
│   │   ├── chat.controller.ts
│   │   ├── coupon.controller.ts
│   │   ├── index.controller.ts
│   │   ├── message.controller.ts
│   │   ├── offer.controller.ts
│   │   ├── review.controller.ts
│   │   ├── task.controller.ts
│   │   ├── tasker.controller.ts
│   │   ├── user.controller.ts
│   ├── DB/
|   |   ├── dao/
|   |   |   ├── base.dao.ts
|   |   |   ├── category.dao.ts
|   |   |   ├── chat.dao.ts
|   |   |   ├── coupon.dao.ts
|   |   |   ├── index.dao.ts
|   |   |   ├── message.dao.ts
|   |   |   ├── offer.dao.ts
|   |   |   ├── review.dao.ts
|   |   |   ├── task.dao.ts
|   |   |   ├── tasker.dao.ts
|   |   |   ├── transaction.dao.ts
|   |   |   ├── user.dao.ts
|   |   ├── models/
|   |   |   ├── category.model.ts
|   |   |   ├── chat.model.ts
|   |   |   ├── coupon.model.ts
|   |   |   ├── index.model.ts
|   |   |   ├── message.model.ts
|   |   |   ├── offer.model.ts
|   |   |   ├── review.model.ts
|   |   |   ├── task.model.ts
|   |   |   ├── tasker.model.ts
|   |   |   ├── transaction.model.ts
|   |   |   ├── user.model.ts
│   │   ├── index.ts
│   ├── docs/
│   │   ├── auth.swagger.ts
│   │   ├── health.swagger.ts
│   │   ├── offers.swagger.ts
│   │   ├── taskers.swagger.ts
│   │   ├── tasks.swagger.ts
│   │   ├── users.swagger.ts
│   ├── dtos
│   │   ├── index.ts
│   │   ├── task.dto.ts
│   │   ├── user.dto.ts
│   ├── exceptions/
|   |   ├── HttpException.ts
│   │   ├── index.ts
│   |   ├── notFoundException.ts
|   |   ├── shutdownHandler.ts
│   ├── helpers/
|   |   ├── log/
|   |   |   ├── devLogger.ts
|   |   |   ├── index.ts
|   |   |   ├── prodLogger.ts
|   |   ├── apiFeatures.ts
│   |   ├── cloudinary.ts
│   |   ├── createToken.ts
│   |   ├── customResponse.ts
│   |   ├── generic.ts
│   |   ├── hashing.ts
│   |   ├── index.ts
│   |   ├── nodemailer.ts
│   |   ├── onesignal.ts
│   |   ├── randomNumbGen.ts
|   |   interfaces/
│   |   ├── auth.interface.ts
│   |   ├── category.interface.ts
│   |   ├── chat.interface.ts
│   |   ├── coupon.interface.ts
│   |   ├── errorResponse.interface.ts
│   |   ├── index.ts
│   |   ├── message.interface.ts
│   |   ├── notification.interface.ts
│   |   ├── offer.interface.ts
│   |   ├── pagination.interface.ts
│   |   ├── response.interface.ts
│   |   ├── review.interface.ts
│   |   ├── routes.interface.ts
│   |   ├── socket.interface.ts
│   |   ├── task.interface.ts
│   |   ├── tasker.interface.ts
│   |   ├── transaction.interface.ts
│   |   ├── user.interface.ts
|   |   ├── middleware/
|   |   |   ├── errors/
|   |   |   |   ├── errorHandler.ts
|   |   |   |   ├── index.ts
|   |   |   |   ├── notFoundHandler.ts
|   |   |   ├── validation/
|   |   |   |   ├── auth.validator.ts
|   |   |   |   ├── category.validator.ts
|   |   |   |   ├── chat.validator.ts
|   |   |   |   ├── coupon.validator.ts
|   |   |   |   ├── index.ts
|   |   |   |   ├── message.validator.ts
|   |   |   |   ├── offer.validator.ts
|   |   |   |   ├── review.validator.ts
|   |   |   |   ├── tasker.validator.ts
|   |   |   |   ├── tasks.validator.ts
|   |   |   |   ├── user.validator.ts
|   |   |   ├── auth.middleware.ts
|   |   |   ├── i18n.middleware.ts
|   |   |   ├── index.ts
|   |   |   ├── middleware.ts
|   |   |   ├── uploadImages.middleware.ts
|   |   ├── routes/
|   |   |   ├── auth.route.ts
|   |   |   ├── category.route.ts
|   |   |   ├── chat.route.ts
|   |   |   ├── coupon.route.ts
|   |   |   ├── healthz.route.ts
|   |   |   ├── index.ts
|   |   |   ├── message.route.ts
|   |   |   ├── offer.route.ts
|   |   |   ├── review.route.ts
|   |   |   ├── routes.ts
|   |   |   ├── task.route.ts
|   |   |   ├── tasker.route.ts
|   |   |   ├── user.route.ts
|   |   |   ├── webhooks.route.ts
|   |   ├── services/
|   |   |   ├── auth.service.ts
|   |   |   ├── category.service.ts
|   |   |   ├── chat.service.ts
|   |   |   ├── coupon.service.ts
|   |   |   ├── index.ts
|   |   |   ├── message.service.ts
|   |   |   ├── offer.service.ts
|   |   |   ├── review.service.ts
|   |   |   ├── task.service.ts
|   |   |   ├── tasker.service.ts
|   |   |   ├── user.service.ts
|   |   |   ├── whatsappClient.service.ts
|   |   ├── sockets/
|   |   |   ├── socket.ts
|   |   ├── Types/
|   |   |   ├── mongoogse-localize.d.ts
|   |   |   ├── xss-clean.d.ts
|   ├── index.ts
|   ├── app.ts
├── .env
├── .gitignore
├── .nvrmc
├── .prettierrc.json
├── jest.config.js
├── LICENSE
├── nodemon.json
├── package-lock.json
├── package.json
├── README.md
├── test.env
├── tsconfig.json

```

# Environment Variables 🌐

```bash

# Create a .env and test.env file for development and testing environment respectively in the root directory and add the following environment variables:
file in the root directory and add the following environment variables:
# APP ENVIRONMENT
PORT="xxxxxxx"
SOCKET_PORT="xxxxxxx"
NODE_ENV="xxxxxxx"
BASE_URL="xxxxxxx"
COMMISSION_RATE="xxxxxxx"
SALT_ROUNDS="xxxxxxx"
defaultLocale="xxxxxxx"
DEVELOPER_EMAIL="xxxxxxx"

# DATABASE CONFIG
DB_URI="xxxxxxx"

# JWT CONFIG
ACCESS_TOKEN_SECRET_KEY="xxxxxxx"
REFRESH_TOKEN_SECRET_KEY="xxxxxxx"
ACCESS_TOKEN_KEY_EXPIRE_TIME="xxxxxxx"
REFRESH_TOKEN_KEY_EXPIRE_TIME="xxxxxxx"
CLIENT_URL="xxxxxxx"
MONGO_URI="xxxxxxx"
JWT_SECRET="xxxxxxx"

# GOOGLE EMAIL CONFIG
GOOGLE_CLIENT_ID="xxxxxxx"
GOOGLE_CLIENT_SECRET="xxxxxxx"

# ONESIGNAL CONFIG
APP_ID="xxxxxxx"
API_KEY="xxxxxxx"
USER_AUTH_KEY="xxxxxxx"

# CLOUDINARY ENVIRONMENT
CLOUDINARY_CLOUD_NAME="xxxxxxx"
CLOUDINARY_API_KEY="xxxxxxx"
CLOUDINARY_API_SECRET="xxxxxxx"

# PAYMOB ENVIRONMENT
PAYMOB_API_KEY="xxxxxxx"
PAYMOB_INTEGRATION_ID="xxxxxxx"
PAYMOB_INTEGRATION_ID_WALLET="xxxxxxx"
PAYMOB_PUBLIC_KEY="xxxxxxx"
PAYMOB_SECRET_KEY="xxxxxxx"
PAYMOB_HMAC_SECRET="xxxxxxx"

FRONTEND_URL="xxxxxxx"
WEB_VERSION="xxxxxxx"

# SMTP CONFIG
SMTP_NAME="xxxxxxx"
SMTP_USERNAME="xxxxxxx"
SMTP_PASSWORD="xxxxxxx"
SMTP_HOST="xxxxxxx"
SMTP_PORT="xxxxxxx"

```

# Getting Started 🚀

```bash
# Clone the repository
git clone https://github.com/fixflex/backend.git

# Go into the repository
cd backend

# Install dependencies
npm install

# Start the server in development mode
npm run start:dev
# Visit http://localhost:port/api-docs to view the API documentation (swagger)

# To run the project in production mode
npm run start:prod

# To run the tests
npm run test

# To build the project
npm run build-ts
```
