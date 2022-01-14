# MongoDB Hackathon 2022

This repository contains source code for a web app to track and manage college applications 
developed and submitted to MongoDB Hackathon 2022 organized by 
[MongoDB](https://www.mongodb.com/blog/post/mongodb-hackathon-here) 
and 
[DEV](https://dev.to/devteam/announcing-the-mongodb-atlas-hackathon-on-dev-4b6m)

### Project Structure

```
root/
 app-client/ : Frontend application built using Angular 
 app-server/ : Backend API built using Express.js and Node.js
 .gitignore
 LICENSE
 README.md
```

### Build and Run Locally

```
/** frontend */
cd app-client
npm install
ng serve

/** api's */
cd app-server
npm install
npm run start:dev
```

Note - You would need __.env__ to run the backend. Please create an Issue 
to request the __.env__ and include your email in the comments. Thank you!