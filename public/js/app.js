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
    for (let i = 0; i < purchaseOrder.length; i++) {
      purchaseOrder.pop();
    }
  }

  const updateInventoryQty = function (pId, newProductData) {
    $.ajax({
      method: 'PUT',
      url: `/api/products/${pId}`,
      data: newProductData
    })
  }

  const validateOrder = function (e) {
    e.preventDefault();
    if (isFillOrder) {
      for (let i = 0; i < purchaseOrder.length; i++) {
        // poIds.push(purchaseOrder[i].id);
        $.get(`/api/product/${purchaseOrder[i].id}`)
          .then(function (data) {
            const newQty = data.avail_quantity - purchaseOrder[i].qty;
            const newProductData = {
              name: data.name,
              department: data.department,
              price: data.price,
              avail_quantity: newQty
            };
            updateInventoryQty(purchaseOrder[i].id, newProductData);
            getAllProducts();
          });
      }
      $('#po-results').addClass('alert alert-info');
      $('#po-results').text('Thank you for your order! Please see email for shipping details!');
    } else {
      $('#po-results').removeClass('alert alert-info');
      $('#po-results').addClass('alert alert-danger');
      $('#po-results').text('Insufficient quantity!');
    }
    clearPurchaseOrder();
  }

  const fillOrder = function () {
    if (isFillOrder) {
      for (let i = 0; i < purchaseOrder.length; i++) {
        $.get(`/api/product/${purchaseOrder[i].id}`)
          .then(function (data) {
            const newQty = data.avail_quantity - purchaseOrder[i].qty;
            totalPrice = parseInt(totalPrice) + parseFloat(purchaseOrder[i].total);
            const newProductData = {
              name: data.name,
              department: data.department,
              price: data.price,
              avail_quantity: newQty
            };
            updateInventoryQty(purchaseOrder[i].id, newProductData);
          });
      }
      console.log(totalPrice);
      $('#po-results').addClass('alert alert-info');
      $('#po-results').text(`Thank you for your order! Your purchase total is: $${totalPrice}. Please see email for shipping details!`);
      getAllProducts();
    } else {
      $('#po-results').removeClass('alert alert-info');
      $('#po-results').addClass('alert alert-danger');
      $('#po-results').text('Insufficient quantity!');
    }
    clearPurchaseOrder();
  }

  const viewCart = function () {
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

  const setIsFillOrderToFalse = function () {
    isFillOrder = false;
  }

  const addCartItem = function (productId, qtyVal) {
    $.get(`/api/product/${productId}`)
      .then(function (data) {
        const purchaseItem = {
          id: productId,
          qty: qtyVal,
          item: data.name,
          price: data.price,
          total: qtyVal * data.price
        }
        if (data.avail_quantity < qtyVal) {
          setIsFillOrderToFalse();
        }
        const idList = [];
        let oldQty = 0;
        for (let i = 0; i < purchaseOrder.length; i++) {
          idList.push(purchaseOrder[i].id);
        }
        if (!idList.includes(productId)) {
          purchaseOrder.push(purchaseItem);
        } else {
          for (let i in purchaseOrder) {
            if (purchaseOrder[i].id == productId) {
              oldQty = purchaseOrder[i].qty;
              const combineQty = parseInt(qtyVal) + parseInt(oldQty);
              const newTotal = combineQty * data.price;
              purchaseOrder.splice(i, 1, {
                id: productId,
                qty: combineQty,
                item: data.name,
                price: data.price,
                total: newTotal.toFixed(2)
              });
            }
          }
        }
      });
  }

  const addToCart = function () {
    const productId = $(this).attr('product-id');
    const cartVal = $(this).attr('cart-name');
    const qtyRow = `qtyRow${cartVal.substring(4)}`;
    const qtyVal = $(`#${qtyRow}`).val();

    addCartItem(productId, qtyVal);
  }

  $(this).on('click', '.cart', addToCart);
  $('#view-cart').on('click', viewCart);
  $('#place-order').on('click', validateOrder);
});


