const path = require('path');

module.exports = function(app) {
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.get('/manager', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/manager.html'));
    });

    app.get('/inventory', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/inventory.html'));
    });

    app.get('/replenish', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/replenish.html'));
    });

    app.get('/new-product', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/new-product.html'));
    });


};