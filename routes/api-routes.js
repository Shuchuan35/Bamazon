const db = require('../models');
const Op = db.Sequelize.Op;

// Routes
module.exports = function (app) {
  // GET route for getting all of the products
  app.get('/api/products', function (req, res) {
    db.Product.findAll({}).then(function (dbProduct) {
      // console.log('=======findAll===========');
      res.json(dbProduct);
    }).catch(function (error) {
      res.json({ error: error });
    });
  });

  app.get('/api/products/:ids', function (req, res) {
    const param = req.param('ids');
    // console.log(param);
    db.Product.findAll({
      where: {
        id:{
          [Op.in]: [req.param("ids")]
        }
      }
    }).then(function (dbProduct) {
      // console.log('=======findAll id IN array===========');
      res.json(dbProduct);
    }).catch(function (error) {
      res.json({ error: error });
    });
  });

  app.get('/api/product/:id', function (req, res) {
    db.Product.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbProduct) {
      console.log('=======findOne===========');
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

  app.get('/api/inventories', function (req, res) {
    db.Product.findAll({
      where: {
        avail_quantity: {
          [Op.lt] : 5
        }
      }
    }).then(function (dbProduct) {
      res.json(dbProduct);
    }).catch(function (error) {
      res.json({ error: error });
    });
  });

};










