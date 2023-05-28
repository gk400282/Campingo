# Yelpcamp
- Clone the repository(git clone ...), or download the zip in your local machine.
- Install dependencies(npm install)
- Install MongoDB, add the bin folder - from the installation directory - to path (to set mongod and mongo shell as environment variable).
- Start mongoDB and create a database called "local" or modify the mongoose.connect... line in app.js to connect to your database.
- Change the port to listen to in App.js to 8080.(app.listen(8080, function(){...}); )
- Start the server from the yelpcamp folder with - npm run start

- If nodemon causes problems, change the "scripts" object's start value to "node app.js" in package.json.
- You may set up the mongoDB database online.
