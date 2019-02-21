const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Sets up server to parse request body for usage
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Routes
require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

const db = require('./models');

// Syncs database first and starts server if the db successfully syncs
db.sequelize.sync().then(function(){

  app.listen(PORT, function(){
    console.log(`App is now listening on PORT ${PORT}`)
  });
  
});
