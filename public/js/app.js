$(document).ready(function () {

  const render = function (products) {
    // $('#product-details').empty();
    console.log('render');
    for (let i = 0; i < products.length; i++) {
      console.log(`${products[i].name}`);
      const productRow = $('<tr>');

      const qtyCol = $('<th>');
      qtyCol.append(`<input type="text" id="qtyRow${i+1}">`);
      productRow.append(qtyCol);

      const productCol = $('<td>');
      productCol.text(`${products[i].name}`);
      productRow.append(productCol);

      const priceCol = $('<td>');
      priceCol.text(`${products[i].price}`);
      productRow.append(priceCol);

      const avilQtyCol = $('<td>');
      avilQtyCol.text(`${products[i].avail_quantity}`);
      productRow.append(avilQtyCol);

      const cartCol = $('<td>');
      const cartButton = $('<button>').addClass('btn btn-warning');
      cartButton.attr('cart-name', `cart${i+1}`);
      cartButton.text('Add to Cart');
      cartCol.append(cartButton);
      productRow.append(cartCol);

      $('#product-details').append(productRow);

      // $('#product-details').append(`<tr>
      // <th><input type="text" id="inputQty"></th>
      // <td>${products[i].name}</td>
      // <td>${products[i].price}</td>
      // <td>${products[i].avail_quantity}</td>
      // <td><button type="button" class="btn btn-warning">Add to Cart</button></td>
      // </tr>`);
    }
  }

  const getProducts = function () {
    console.log('getProducts');
    // $.get('/api/products')
    // .then(function (data){
    //   console.log(data);
    //   render(data);
    // })
    $.ajax({
      method: 'GET',
      url: 'api/products'
    }).then(function (res) {
      // console.log(res);
      render(res);
    });
  }
  getProducts();

  const addToCart = function (e) {
    e.preventDefault();
    console.log('Hi Cart');
    const cartVal = $(this).attr('cart-name');
    console.log(cartVal);
  }
  // $('.btn').on('click', addToCart);
  $('.btn').on('click', addToCart);

});









