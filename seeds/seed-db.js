const db = require('../models');

// Syncing sequelize models 
db.sequelize.sync().then(function() {
  db.Product.bulkCreate([{
    name: 'Dyson Purifer Heater',
    department: 'Home',
    price: 102.99,
    avail_quantity: 100
  },{
    name: 'Nest Cam Indoor Smart Security Camera',
    department: 'Home',
    price: 172.99,
    avail_quantity: 100
  },{
    name: 'Samsonite Carry-on Spinner',
    department: 'Home',
    price: 112.99,
    avail_quantity: 100
  },{
    name: 'Hamilton Beach Toaster',
    department: 'Home',
    price: 122.99,
    avail_quantity: 100
  },{
    name: 'CHANEL COCO WOMEN Parfum',
    department: 'Beauty',
    price: 145.00,
    avail_quantity: 100
  },{
    name: 'COACH For Men 3-Piece Set',
    department: 'Beauty',
    price: 142.99,
    avail_quantity: 100
  },{
    name: 'French Girl Rose Sea Soak - Calming Bath Salts',
    department: 'Beauty',
    price: 22.99,
    avail_quantity: 100
  },{
    name: 'philosophy Hope In Your Hands 4-Piece Set',
    department: 'Beauty',
    price: 28.00,
    avail_quantity: 100
  },{
    name: 'FAO Schwarz 30-Piece Motorized Train Set',
    department: 'Children',
    price: 82.99,
    avail_quantity: 100
  },{
    name: 'Alex Toys Artist Studio My Art Desk',
    department: 'Children',
    price: 310.00,
    avail_quantity: 100
  },{
    name: 'Janod Bikloon Balance Bike',
    department: 'Children',
    price: 159.00,
    avail_quantity: 100
  }]).then(function(){
    console.log('Data successfully added!');
    db.sequelize.close();
  }).catch(function(error) {
    console.log('Error', error)
  });
});