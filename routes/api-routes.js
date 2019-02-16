const db = require('../models');

// Routes
module.exports = function (app) {
  console.log('Hi there!...');
  // GET route for getting all of the products
  app.get('/api/products', function (req, res) {
    // db.Product.findAll({}).then(function (data) {
    //   console.log(JSON.stringify(data, null, 2));
      
    // }).catch(function (error) {
    //   console.log('Error:', error);
    // });
    
    db.Product.findAll({}).then(function (dbProduct) {
      console.log('=======findAll===========');
      res.json(dbProduct);
    }).catch(function (error) {
      res.json({ error: error });
    });

  });

  app.get('/api/products/:id', function (req, res) {
    db.Product.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbProduct) {
      res.json(dbProduct);
    }).catch(function (error) {
      res.json({ error: error });
    });
  });

  app.post('/api/products', function (req, res) {
    db.Product.create(req.body).then(function (dbProduct) {
      res.json(dbProduct);
    }).catch(function (error) {
      res.json({ error: error });
    });
  });

  app.put('/api/products/:id', function (req, res) {
    db.Product.update(
      req.body,
      {
        where: {
          id: req.params.id
        }
      }).then(function (dbProduct) {
        res.json(dbProduct);
      }).catch(function (error) {
        res.json({ error: error });
      });
  });

};










