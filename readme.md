# **Simple CRUD API**

This is a simple CRUD API built with Node.js and TypeScript. 
It uses HTTP methods to perform CRUD operations on an in-memory database.


## **Installation**


1) Clone the repository: git clone -b development https://github.com/JamshidRashidov97/CRUD-API.git.
2) Install the dependencies:
   - cd simple-crud-api
   - npm install
3) Rename the .env.example file to .env.
4) Start the server: 
   - npm run start:dev
   - npm run start:prod


   
## **Usage**

The API exposes the following endpoints:

- GET /api/users - Returns a list of all users.
- GET /api/users/{userId} - Returns a single user by ID.
- POST /api/users - Creates a new user.
- PUT /api/users/{userId} - Updates an existing user by ID.
- DELETE /api/users/{userId} - Deletes a user by ID.

To test the API, you can use a Postman. If you are new to Postman API testing, please go over this [tutorial](https://www.youtube.com/watch?v=uWrw0Bh7BVM&ab_channel=codebubb) to get started.



## **Contributing**
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

