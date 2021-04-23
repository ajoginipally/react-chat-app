# React Sample Project API

This repository includes a simple API for use in the react sample project.

## Installation

In order to run this project you will need to have (Node JS)[https://nodejs.org/en/] installed.  With node, comes the package manager (NPM)[https://www.npmjs.com/].

Run the following command from the root of this directory to install the dependencies.

```
$ npm install
```

## Running the Application

The following command will run the project using nodemon and refresh the server upon any changes to `.ts` files:

```
$ npm start
```

## Communicating with the API

The api should be available at http://localhost:8080.  To verify this you can run the following `curl` command to do a health check.  You should receive a 200 response.

```
$ curl http://localhost:8080/health
```

## Endpoints

The following endpoints are available via the API:

### GET - /health
**Required fields:** None

**Response:** 200

### GET - /v1/messages
**Required fields:** None

**Response:** 200

```
{
  "message": Array
}
```

### POST - /v1/messages/send
**Required fields:**
	- message: The message to send to the bot

**Response:** 200

```
{
  "response": String
}
```

**Response:** 400

```
{
  "error": String
}
```
