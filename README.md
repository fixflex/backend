# For more info about the project check the [Documentation](https://github.com/fixflex/)

# Table of Contents 📜

- [Tech Stack And Tools ✨](#tech-stack-and-tools-✨)
- [Deployment (Stack & Tools 🚀)](#deployment-stack-and-tools-🚀)
- [Features 📌](#features-📌)

  - [Core Features](#core-features-🌟)
  - [Additional Features](#additional-features-🌟)
  - [Code Features](#code-features-🌟)
  - [Security Features](#security-features-🌟)
  - [Future Features](#future-features-🚀)

- [Architecture 🏗️](#architecture-🏗️)

  <!--
  - [Model-View-Controller (MVC) Pattern](#model-view-controller-mvc-pattern-🌐)
  - [Data Access Object (DAO) Pattern](#data-access-object-dao-pattern-💾)
  - [Data Transfer Object (DTO) Pattern](#data-transfer-object-dto-pattern-📦)
  - [Service Layer](#service-layer-🛠️)
  - [Middleware](#middleware-🚪)
  - [Dependency Injection](#dependency-injection-🔄)
  - [Database Schema](#database-schema-📊)
  - [RESTful API Design](#restful-api-design-📐) -->

- [Error Handling 🚨](#error-handling-🚨)

- [API Endpoints](#api-endpoints-🚀)

- [Project Structure 📁](#project-structure-📁)

- [Environment Variables 🌐](#environment-variables-🌐)

- [Getting Started](#getting-started-🚀)

- [Author 🙋‍♂️](#author-🙋‍♂️)

# Tech Stack And Tools ✨

- `TypeScript`: A typed superset of JavaScript that compiles to plain JavaScript, used to add static types to JavaScript and improve code quality.
- `Node.js`: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building scalable network applications.
- `Express.js`: A fast, unopinionated, minimalist web framework for Node.js, used for building APIs and web applications.
- `MongoDB`: A NoSQL database used for storing data in a flexible, JSON-like format.
- `Redis`: An in-memory data structure store used as a cache, message broker, and session store.
- `Jest`: A JavaScript testing framework used for unit testing and assertions, used to validate code functionality and identify bugs.
- `Paymob`: A payment gateway used to facilitate secure online payments between users and taskers.
- `OneSignal`: A push notification service used to send push notifications to users and taskers for task updates, messages, reminders, and other relevant events.
- `Cloudinary`: A cloud-based image and video management service used to store, manage, and deliver images and videos for the application.
- `Socket.io`: A library used to enable real-time, bidirectional communication between clients and servers using WebSockets.
- `Swagger`: An open-source software framework used to design, build, document, and consume RESTful web services.
- `i18next`: An internationalization (i18n) library used to support multiple languages and locales in the application.
- `Google OAuth 2.0`: An authentication and authorization service used to allow users to sign in using their Google accounts.
- `Whatsapp-web.js`: A WhatsApp API used to send WhatsApp messages to users and taskers for task updates, reminders, and other relevant events.
- `Nodemailer`: A module used to send emails from the application to users and taskers for account verification, password reset, task updates, and other events.
- `Winston`: A logging library used to log application behavior and performance to track errors and debug issues.

# Deployment Stack And Tools 🚀

The backend of `fixflex` is deployed using the following technologies and tools:

- `AWS (EC2)`: A cloud computing service used to deploy and host the backend of `fixflex`.
- `GitHub Actions`: Automated workflows triggered by GitHub events, used for continuous integration and continuous deployment (CI/CD) pipelines.
- `Docker swarm`: A container orchestration tool used to deploy and manage Docker containers in a clustered environment.
- `Nginx`: A web server used as a reverse proxy, load balancer.
- `Mongo Atlas`: A cloud-based database service used to host MongoDB databases.
- `Upstash-Redis`: A cloud-based Redis service.
- `Render`: A cloud-based platform used to deploy and host the testing environment of `fixflex`.

![diagram-export-7-5-2024-9_14_27-PM](https://github.com/fixflex/backend/assets/124518625/552c54db-c20a-4bd1-ac82-5170548b51c1)

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

- [x] `Multi-Language Support`: Supports multiple languages (ar & en) and locales to cater to a diverse user base, providing a localized experience.
- [x] `Email Notifications`: Sends automated email notifications to users and taskers for account verification, password reset, task updates, and other events.
- [x] `Push Notifications`: Sends push notifications using OneSignal to users and taskers for task updates, messages, reminders, and other relevant events.
- [x] `Testing Suite`: Includes a comprehensive testing suite comprising unit tests, integration tests to ensure code reliability and maintainability.
- [x] `Continuous Integration/Deployment (CI/CD)`: Integrates automated testing and deployment processes to streamline development workflows using GitHub Actions.
- [x] `WebSockets`: Implements real-time communication between clients and the server using WebSockets, enabling interactive features such as live chat or notifications.
- [x] `CRUD Operations`: Implements Create, Read, Update, and Delete operations for all resources using RESTful API design.
- [x] `API Versioning`: Organizes API endpoints into versions for better management, with the current version being `v1`.
- [x] `Geolocation Services`: Integrates geolocation services to provide location-based functionalities such as finding nearby service providers.

### Code Features 🌟

- [x] `TypeScript`: Utilizes TypeScript to add static types to JavaScript, improving code quality, and catching errors early in the development process.
- [x] `RESTful API Design`: Adheres to RESTful API design principles to create a standardized and predictable API interface for clients to interact with.
- [x] `Scalable Architecture`: Implements a scalable architecture to accommodate future growth and changes in the application's requirements.
- [x] `Modular Architecture`: Organizes code into classes, and functions to improve code readability, and maintainability using the MVC and DAO (Data Access Object) pattern.
- [x] `Dependency Injection`: Implements dependency injection using tsyringe package to manage component dependencies and improve code maintainability, flexibility.
- [x] `Code Linting`: Enforces code style and quality standards using prettier.
- [x] `Code Testing`: Implements unit tests, integration tests using Jest and supertest to validate code functionality, identify bugs, and ensure code reliability.
- [x] `API Documentation`: Provides comprehensive documentation for APIs using tools like Swagger and postman to facilitate code maintenance and collaboration.
- [x] `Code Version Control`: Utilizes version control systems such as Git to track code changes.
- [x] `Environment Configuration`: Utilizes environment variables to manage configuration settings and sensitive information, ensuring security and flexibility.
- [x] `Best Practices & Clean Code`: Follows best practices and clean code principles such as ( SOLID, DRY, KISS )

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

- [ ] `Task Recommendations`: Provides personalized task recommendations based on user preferences, history, and behavior, enhancing user engagement.
- [ ] `Tasker Matching Algorithm`: Develops a tasker matching algorithm to recommend the most suitable taskers for specific tasks based on skills, ratings, and availability.
- [ ] `Tasker Performance Metrics`: Provides taskers with performance metrics, analytics, and insights to help them improve their services and grow their businesses.
- [ ] `Third-Party API Integration`: Integrates third-party APIs such as Twilio, or Mailgun to enhance functionality and provide additional features.

# Architecture 🏗️

The backend of `fixflex` follows a modular, scalable, and maintainable architecture. The architecture is designed to ensure code reusability, separation of concerns, and scalability to accommodate future growth and changes in the application's requirements.

## Model-View-Controller (MVC) Pattern 🌐

The backend architecture of `fixflex` follows the Model-View-Controller (MVC) pattern, which divides the application into three main components:

- `Models`: Represents the data structure of the application, interacts with the database using Mongoose, and defines the schema for each resource.
- `Controllers`: Processes incoming requests, interacts with services, and returns responses to clients.
- `Routes`: Defines the API endpoints, maps HTTP methods to controller actions, and provides a standardized interface for clients to interact with the application.

## Data Access Object (DAO) Pattern 💾

The backend architecture of `fixflex` employs the Data Access Object (DAO) pattern to separate the data access logic from the business logic. The DAO pattern encapsulates the database operations for each resource into a separate file, providing a clean and modular structure for managing data access.

## Data Transfer Object (DTO) Pattern 📦

The backend architecture of `fixflex` uses Data Transfer Objects (DTOs) to transfer data between layers and components. DTOs define the structure of data exchanged between the client and server, ensuring consistency and type safety throughout the application.

## Service Layer 🛠️

The backend architecture of `fixflex` includes a service layer that encapsulates the business logic of the application, interacts with the data access layer, and provides a centralized interface for controllers to access application functionality. The service layer helps maintain separation of concerns, improves code reusability, and facilitates testing and debugging.

## Middleware 🚪

The backend architecture of `fixflex` includes middleware functions that intercept incoming requests, perform actions, and pass control to the next middleware or route handler. Middleware functions are used for tasks such as authentication, error handling, logging, input validation, and more, providing a modular and extensible architecture for managing request processing.

## Dependency Injection 🔄

The backend architecture of `fixflex` employs dependency injection using the tsyringe package to manage component dependencies and improve code maintainability, flexibility, and testability. Dependency injection helps decouple components, promote code reuse, and facilitate the implementation of inversion of control (IoC) principles.

## Database Schema 📊

The database used for `fixflex` is MongoDB, a NoSQL database that stores data in a flexible, JSON-like format.

### Why MongoDB? 🤔

#### MongoDB is the suitable database for `fixflex` due to the following reasons:

- `Geospatial Data Handling`: MongoDB has robust support for geospatial data, allowing FixFlex to efficiently store and query location-based data. This is particularly useful for matching tasks with nearby taskers and providing location-based search results.

- `Real-Time Data Processing`: MongoDB provides real-time data processing capabilities, enabling FixFlex to handle real-time updates, notifications, and messaging between users and taskers.

- `Cloud Integration with MongoDB Atlas`: MongoDB Atlas provides a cloud-based database service that offers high availability, scalability, and security, Plus, it offers a free tier to get started! 😊

<!-- See [Database Schema](MongoDB-schema-visualization.md) file for more details. -->

The database schema for `fixflex` consists of the following collections:

- `Users`: Stores user information such as name, email, phone number, password, role, profile picture, and verification status.
- `Taskers`: Stores tasker information such as user ID, description, skills, qualifications, availability, ratings, and earnings.
- `Tasks`: Stores task information such as user ID, title, description, category, location, status, budget, images, and timestamps.
- `Categories`: Stores category information such as name, description, parent category, and subcategories.
- `Coupons`: Stores coupon information such as code, discount amount, expiry date, and usage limit.
- `Offers`: Stores offer information such as task ID, tasker ID, amount, status, and timestamps.
- `Reviews`: Stores review information such as task ID, tasker ID, user ID, rating, comment, and timestamps.
- `Chats`: Stores chat information such as user IDs, task ID, tasker ID, and timestamps.
- `Messages`: Stores message information such as chat ID, user ID, tasker ID, content, and timestamps.
- `Transactions`: Stores transaction information such as user ID, tasker ID, amount, type, status, and timestamps.

For more details, see the [Database Schema](https://github.com/fixflex/backend/assets/124518625/c094b37f-0e4b-41a6-9d28-2df0da258110)

## RESTful API Design 📐

The API design for `fixflex` follows RESTful principles, with clear and predictable URL structures, HTTP methods, and status codes. The API endpoints are organized into resource-based routes, with each route corresponding to a specific resource or entity in the system. The API design includes the following key features:

- `Resource-Based Routes`: Organizes API endpoints into resource-based routes such as /users, /tasks, /taskers, /offers, /reviews, /categories, and /coupons.
- `CRUD Operations`: Implements Create, Read, Update, and Delete operations for all resources using HTTP methods such as GET, POST, PUT, PATCH, and DELETE.
- `Pagination and Filtering`: Supports pagination and filtering for listing resources, allowing users to limit the number of results and filter based on specific criteria.
- `Search and Sorting`: Allows users to search for resources based on keywords, categories, locations, and other criteria, enhancing resource discovery.
- `Error Handling`: Provides informative error messages, status codes, and error responses to help clients understand and handle errors effectively.

## Error Handling 🚨

The backend architecture of `fixflex` includes a robust error handling mechanism to catch and handle exceptions gracefully, providing informative error messages, status codes, and error responses to clients. The error handling mechanism includes the following key features:

- `Custom Exceptions`: Defines custom exception classes to handle errors and exceptions in the application, providing detailed error messages and status codes.
- `Error Middleware`: Implements error middleware functions to catch and handle exceptions, log errors, and send error responses to clients.
- `Global Error Handling`: Centralizes error handling logic in a global error handler middleware to ensure consistent error responses across the application.
- `Error Logging`: Logs errors and exceptions to track application behavior, monitor performance, and debug issues effectively.
- `Error Response Format`: Standardizes error responses with a consistent format, including status codes, error messages, error details, and stack traces.

# API Documentation 📖

The API documentation for `fixflex` is available using [Swagger UI](https://server.fixflex.tech/api-docs) and [Postman Collection](https://documenter.getpostman.com/view/24552265/2sA2r53QzT#intro).

## API Endpoints 🚀

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
├── .github/
│   ├── workflows/
│   │   ├── ci-dockerhub.yml
│   │   ├── deploy-sta.yml
│   │   ├── test.yml
├── locales/
│   ├── ar/
│   │   ├── translation.json
│   ├── en/
│   │   ├── translation.json
│   ├── missing.json
├── nginx/
│   ├── default.conf
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
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.sta.yml
├── docker-compose.tes.yml
├── docker-compose.yml
├── Dockerfile
├── eslintrc.json
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
REDIS_URL="xxxxxxx"


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

# Using Docker compose 🐳
docker compose -f docker-compose.yml -f docker-compose.sta.yml build   # Build the project
docker compose -f docker-compose.yml -f docker-compose.dev.yml up      # Start the project

# Using npm 📦

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

# Author 🙋‍♂️

- [GitHub](https://github.com/ahmadalasiri)

```

# Happy Coding ⚡️
```
