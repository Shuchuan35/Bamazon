module.exports = function(connection, Sequelize) {
    const Product = connection.define('Product', {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'N/A'
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      avail_quantity: {
          type: Sequelize.INTEGER,
          defaultValue: 0
      }
    });
  
    return Product;
  }