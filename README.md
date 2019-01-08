# Yelpcamp
- App hosted on cloud9 ide, setting the app there would be easier.
- You can just clone and paste the files there, and after installing dependencies(npm install) do a - nodemon app.js
- To set it up locally, clone the repo and use npm install to download the dependencies
- change the port to listen on in App.js to 8080.(app.listen(8080, function(){...}); )
- npm start

- if nodemon is causing problems, change the scripts object's start value to "node app.js" in Package.json.
- You may set up the mongoDB server locally if you wish to create a database locally.
