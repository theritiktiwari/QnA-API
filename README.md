# CracKube

This is the API documentation for the Q&A website. This API allows to create a user, admin can perform the CRUD operation to user. User can create questions and can perform the CRUD operation on that. They can also provide answer to the particular question, and can also perform the CRUD operation. For the question there is pagination also, so that user can see the questions in multple pages. Base limit is 10, but user can also provide the limit and page number to see the questions accordingly.

## Installation
- Clone the repository in your local machine.
- Run the following command to install the dependencies.
```bash
yarn install OR npm install
```
- Create a mongoDB cluster and use the connection string in the ```.env``` file.
- Create a .env file in the root directory and add the following variables.
```bash
MONGO_URI=<YOUR_MONGO_URI>
JWT_SECRET=<YOUR_JWT_SECRET>
CRYPTOJS_SECRET_KEY=<YOUR_CRYPTOJS_SECRET_KEY>
PORT=5000
```
- JWT & CryptoJS secret keys can be any random string.
- Run the following command to start the server.
```bash
yarn dev OR npm dev
```
- The server will be running on port 5000.
- Ther is a file "[API_Collection.json]("./API_Collection.json)" which can be imported in Thunder Client (VS Code extension) to test the APIs.

## API Endpoints
- The base URL is ```http://localhost:5000/api```.
- The following endpoints are available:
  - ```/auth``` - Authentication & Authorization APIs.
  - ```/questions``` - Question APIs.
  - ```/answers``` - Answer APIs.

### Authentication & Authorization APIs
- The following APIs are available:
  - ```POST /auth/newuser``` - Register a new user.
  - ```POST /auth/login``` - Login an existing user.
  - ```POST /auth/getuser``` - Get the details of the logged in user.
  - ```PUT /auth/update/:id``` - Update a user by ID. 
  - ```POST /auth/users``` - Get all the users. (Only for admin)
  - ```POST /auth/user/:id``` - Get a user by ID. (Only for admin)
  - ```DELETE /auth/delete/:id``` - Delete a user by ID. (Only for admin)

### Question APIs
- The following APIs are available:
  - ```POST /questions``` - Create a new question.
  - ```GET /questions``` - Get all the questions.
  - ```GET /questions/my``` - Get questions posted by user.
  - ```PUT /questions/:id``` - Update a question by ID.
  - ```DELETE /questions/:id``` - Delete a question by ID.

### Answer APIs
- The following APIs are available:
  - ```POST /answers``` - Create a new answer.
  - ```GET /answers``` - Get all the answers of a question.
  - ```GET /answers/my``` - Get all the answers posted by user.
  - ```PUT /answers/:id``` - Update an answer by ID.
  - ```DELETE /answers/:id``` - Delete an answer by ID.


### Note
- The APIs are secured using JWT.
- The APIs are tested using Thunder Client (VS Code extension).
- Admin can perform the CRUD operation on users, questions and answers.
- User can perform the CRUD operation on questions and answers posted by them.
- User can also see the questions & answers posted by other users.
- User can also see the answers of a particular question.
- If a question is deleted, all the answers of that question will also be deleted.


## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- CryptoJS
- Thunder Client (VS Code extension)
