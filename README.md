# CracKube

This is an API for Q&A website, for more details please refer to the documentation.

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
- For the documetation of API, open the home page of the server in browser.
```bash
http://localhost:5000
```