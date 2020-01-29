# Chat App - MERN with Socket.IO

## Summary

This is a chat application built on the MERN stack, using Socket.IO requests to communicate between server and client.

This repo includes SERVER-SIDE code for:

- running server;
- connecting to DB;
- 'Messages' API, with POST, GET and DELETE endpoints for creating/deleting messages & fetching them from DB

CLIENT-SIDE code:

- 'client' directory with React app, created using [Create React App](https://github.com/facebook/create-react-app)
- ChatApp component
- styling for a chat window displayed on desktop

## Reference Materials

#### SocketIO

- [HTTP Module](https://nodejs.org/api/http.html#http_class_http_agent)

#### MERN: Combining Client-Side and Server-Side Code

- [How to get 'create-react-app' to work with your API](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/) (~15-min read) -- this is a thorough guide for bringing client and server code together. It addresses file structure, using concurrently to run server and client simultaneously and implementing a proxy for API requests (read more below)
- [Proxying API Requests in Development](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development) -- a proxy is needed for the client to fetch from the server using a relative path and to avoid a CORS error.

#### Input and Events in React

- [React: Forms](https://reactjs.org/docs/forms.html)
- [React: Handling Events](https://reactjs.org/docs/handling-events.html)
- [How to Work with Forms, Inputs and Events in React](https://medium.com/capital-one-tech/how-to-work-with-forms-inputs-and-events-in-react-c337171b923b)

#### State and Lifecycle

- [React Components: State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html) - it's a common pattern to use state to keep input values in sync between user and client. This helps ensure that accurate information is refelcted in the UI and sent to the server for an AJAX call. See the following example implementation of **state** with **fetching and processing data from the server**: [State Updates are Merged](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-are-merged)

#### Lists using map() in React

- [React: Lists and Keys](https://reactjs.org/docs/lists-and-keys.html) - patterns for displaying a list of items in React using **map()**. Items can be simple, such as the numbers example on the top. They can also be more complex, mapping items from a list and displaying multiple properties from a data set in a unique "ListItem" component. See this example: [Embedding map() in JSX](https://reactjs.org/docs/lists-and-keys.html#embedding-map-in-jsx).

#### AJAX and React Fetch

- [React: AJAX and APIs](https://reactjs.org/docs/faq-ajax.html) - includes example using **fetch()** and the React Component lifecycle method **componentDidMount()**.
- [React: Fetching Data with AJAX Requests](https://facebook.github.io/create-react-app/docs/fetching-data-with-ajax-requests)
- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) - how to use the **fetch() method**, how it uses Promises, and differs from jQuery AJAX, etc.

## Prerequisites

- Node
- NPM

```
$ node -v
$ npm -v
```

- React

## Installing

Steps for getting a local development env running

### 1 - Install dependencies

Install node modules:

```
$ cd chatbot-01
$ npm install
```

### 2 - Git & Gitignore file

Initialize Git in local repo:

```
git init
```

Create **.gitignore** file (if it doesn't already exist)

```
touch .gitignore
echo "/node_modules" >> .gitignore
echo ".DS_Store" >> .gitignore
```

Create a new empty remote git project (ex - on GitLab)

Add remote branch to local repo & push to remote

```
git remote add origin git@gitlab.com:YOUR-PROJECT-URL.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

### 3 - Environment variables & ENV file

If you don't have a MongoDB Atlas account, sign up for one and complete the following steps. Otherwise skip to creating an ENV file.

1. Create new MongoDB Atlas account
2. Create new cluster
3. Crate new user called 'admin'
4. Make a local copy of your cluster name and admin password.

Create **.env** file at the root of this project. Replace 'password' and 'cluster-name' with yours.

```
touch .env
echo "MONGO_ATLAS_ADMIN_PW=password" >> .env
echo "MONGO_ATLAS_CLUSTER=cluster-name" >> .env
```

## Running locally

### Run client and server simultaneously

From the root directory, enter the following command to run the client and server scripts, using the [concurrently](https://www.npmjs.com/package/concurrently) node module:

```
$ npm start
```

### Run server

From the root directory:

```
$ npm server
```

The following messages should display in the terminal:

```
Server running on port 5000
MongoDB connection established
```

### Run client

From the root directory:

```
cd client
npm start
```

React app will open on in browser: http://localhost:3000/

## Usage

## Built With

- React
- Node
- Express
- MongoDB Atlas
- Mongoose

## Authors

Dave Gentilli
