
const render = function (products) {
  // $('#product-details').empty();
  console.log('render');
  for (let i = 0; i < products.length; i++) {
    console.log(`${products[i].name}`);
    $('#product-details').append(`<tr><th>2</th><td>${products[i].name}</td>
    <td>${products[i].price}</td>
    <td>${products[i].avail_quantity}</td></tr>`);
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









