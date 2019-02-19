$(document).ready(function () {
  const purchaseOrder = [];
  let isFillOrder = true;
  let totalPrice = 0;
  const render = function (products) {
    $('#product-details').empty();

    for (let i = 0; i < products.length; i++) {
      // console.log(`${products[i].name}`);
      const productRow = $('<tr>').addClass('productRow');

      const qtyCol = $('<th>');
      qtyCol.append(`<input type="text" id="qtyRow${i + 1}">`);
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
      const cartButton = $('<button>').addClass('btn btn-warning cart');
      cartButton.attr('cart-name', `cart${i + 1}`);
      cartButton.attr('product-id', `${products[i].id}`);
      cartButton.text('Add to Cart');
      cartCol.append(cartButton);
      productRow.append(cartCol);

      $('#product-details').append(productRow);
    }
  }

  const getAllProducts = function () {
    $.ajax({
      method: 'GET',
      url: 'api/products'
    }).then(function (res) {
      render(res);
    });
  }
  getAllProducts();

  const clearPurchaseOrder = function () {
    for (let i = purchaseOrder.length; i > 0; i--) {
      purchaseOrder.pop();
    }
    setIsFillOrder(true);
    // console.log('purchaseOrder item: ' + purchaseOrder.length);
  }

  const updateInventoryQty = function (pId, newData) {
    // $.put(`/api/products/${pId}`, newData)
    //   .then(function (data) {
    //     getAllProducts();
    //   });

    $.ajax({
      method: 'PUT',
      url: `/api/products/${pId}`,
      data: newData
    }).then(function(data){
      getAllProducts();
    });
  }


  const fillOrder = function () {
    for (let i = 0; i < purchaseOrder.length; i++) {
      const poId = purchaseOrder[i].id;
      const poQty = purchaseOrder[i].qty;
      $.get(`/api/product/${poId}`)
        .then(function (data) {
          const newQty = parseInt(data.avail_quantity) - parseInt(poQty);
          // totalPrice = parseInt(totalPrice) + parseFloat(purchaseOrder[i].total);
          const newProductData = {
            name: data.name,
            department: data.department,
            price: data.price,
            avail_quantity: newQty
          };
          updateInventoryQty(poId, newProductData);
        });
    }
  }

  const validateOrder = function (e) {
    e.preventDefault();
    if (isFillOrder) {
      fillOrder();
      $('#po-results').removeClass('alert alert-danger');
      $('#po-results').addClass('alert alert-info');
      $('#po-results').text(`Thank you for your order! Please see email for shipping details!`);
      clearPurchaseOrder();
    } else {
      $('#po-results').removeClass('alert alert-info');
      $('#po-results').addClass('alert alert-danger');
      $('#po-results').text('Insufficient quantity!');
      clearPurchaseOrder();
    }
  }

  const viewCart = function (e) {
    e.preventDefault();
    $('#purchase-order').empty();

    for (let i = 0; i < purchaseOrder.length; i++) {
      $('#purchase-order').append(`<tr>
      <th scope="row">${i + 1}</th>
      <td>${purchaseOrder[i].qty}</td>
      <td>${purchaseOrder[i].item}</td>
      <td>${purchaseOrder[i].price}</td>
      <td>${purchaseOrder[i].total}</td>
      </tr>`);
    }
  }

  const addToTotalPrice = function(price) {
    totalPrice += parseInt(price);
  }

  const setIsFillOrder = function (fill) {
    isFillOrder = fill;
  }

  const addCartItem = function (productId, qtyVal) {
    $.get(`/api/product/${productId}`)
      .then(function (data) {
        let cartQty = qtyVal;
        const total = cartQty * data.price;
        const purchaseItem = {
          id: productId,
          qty: cartQty,
          item: data.name,
          price: data.price,
          total: total.toFixed(2)
        }
        const idList = [];
        for (let i = 0; i < purchaseOrder.length; i++) {
          idList.push(purchaseOrder[i].id);
        }
        if (!idList.includes(productId)) {
          purchaseOrder.push(purchaseItem);
        } else {
          for (let i in purchaseOrder) {
            if (purchaseOrder[i].id == productId) {
              const oldQty = purchaseOrder[i].qty;
              cartQty = parseInt(qtyVal) + parseInt(oldQty);
              const newTotal = cartQty * data.price;
              purchaseOrder.splice(i, 1, {
                id: productId,
                qty: cartQty,
                item: data.name,
                price: data.price,
                total: newTotal.toFixed(2)
              });
            }
          }
        }
        console.log('cartQty: ' + cartQty);
        if (data.avail_quantity < cartQty) {
          setIsFillOrder(false);
        }
        console.log('isFillOrder: ' + isFillOrder);
      });
  }

  const removeMessage = function() {
    $('#po-results').removeClass('alert alert-info');
    $('#po-results').removeClass('alert alert-danger');
    $('#po-results').text('');
  }

  const addToCart = function (e) {
    e.preventDefault();
    const productId = $(this).attr('product-id');
    const cartVal = $(this).attr('cart-name');
    const qtyRow = `qtyRow${cartVal.substring(4)}`;
    const qtyVal = $(`#${qtyRow}`).val();
    removeMessage();
    addCartItem(productId, qtyVal);
  }

  $(this).on('click', '.cart', addToCart);
  $('#view-cart').on('click', viewCart);
  $('#place-order').on('click', validateOrder);
});


