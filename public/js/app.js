$(document).ready(function () {

  const purchaseOrder = [];
  let totalPrice = 0;

  const render = function (products) {
    $('#product-details').empty();

    for (let i = 0; i < products.length; i++) {
      // console.log(`${products[i].name}`);
      const productRow = $('<tr>').addClass('productRow');

      const input = $('<input>').attr({
        type: 'number',
        min: 1,
        id: `${products[i].id}`
      });

      const cartButton = $('<button>')
        .addClass('btn btn-warning cart')
        .attr('product-id', `${products[i].id}`)
        .text('Add to Cart');

      productRow.append(
        $('<td>').append(input),
        $('<td>').text(`${products[i].name}`),
        $('<td>').text(`${products[i].avail_quantity}`),
        $('<td>').text(`${products[i].price}`),
        $('<td>').append(cartButton)
      );

      $('#product-details').append(productRow);
    }
  }

  const getAllProducts = function () {
    $.ajax({
      method: 'GET',
      url: 'api/products'
    }).then(render);
  }
  getAllProducts();

  const updateInventoryQty = function (pId, newData) {
    $.ajax({
      method: 'PUT',
      url: `/api/products/${pId}`,
      data: newData
    }).then(function (data) {
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

  const resetPurchaseOrder = function () {
    for (let i = purchaseOrder.length; i > 0; i--) {
      purchaseOrder.pop();
    }
  }

  const displayMessage = function () {
    totalPrice = purchaseOrder.reduce((acc, cur) => acc + parseFloat(cur.total), 0);
    $('#po-results').removeClass('alert alert-danger')
      .addClass('alert alert-info')
      .text(`Thank you for your order! Your order total is $${totalPrice}!`);
    resetPurchaseOrder();
  }

  const processOrder = function (e) {
    e.preventDefault();
    fillOrder();
    setTimeout(displayMessage, 500);
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

  const insufficientQty = function (qty, requestedQty) {
    $('#po-results').removeClass('alert alert-info')
      .addClass('alert alert-danger')
      .html(`<i class="fa fa-exclamation-circle fa-lg" aria-hidden="true"></i> 
   Insufficient quantity! Product has ${qty} in stock, your ordered ${requestedQty}. 
  Please adjust your order quantity before proceed to check out.`);
  }

  const addPurchaseOrderItem = function (data, productId, requestedQty, purchaseItem) {
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
          requestedQty = parseInt(requestedQty) + parseInt(oldQty);

          if (data.avail_quantity < requestedQty) {
            insufficientQty(data.avail_quantity, requestedQty);
          } else {
            const newTotal = requestedQty * data.price;
            purchaseItem.qty = requestedQty;
            purchaseItem.total = newTotal.toFixed(2);
            purchaseOrder.splice(i, 1, purchaseItem);
          }
        }
      }
    }
  }

  const addCartItem = function (productId) {

    $.get(`/api/product/${productId}`)
      .then(function (data) {
        const requestedQty = $(`#${data.id}`).val();

        if (data.avail_quantity < requestedQty) {
          insufficientQty(data.avail_quantity, requestedQty);
        } else {
          const total = requestedQty * data.price;

          const purchaseItem = {
            id: productId,
            qty: requestedQty,
            item: data.name,
            price: data.price,
            total: total.toFixed(2)
          }
          addPurchaseOrderItem(data, productId, requestedQty, purchaseItem);
          $(`#${data.id}`).val('');
        }
      });
  }

  const clearMessage = function () {
    $('#po-results').removeClass().text('');
  }

  const addToCart = function (e) {
    e.preventDefault();
    const productId = $(this).attr('product-id');

    clearMessage();
    addCartItem(productId);
  }

  //==================================
  // Event Listeners
  //==================================

  $(this).on('click', '.cart', addToCart);
  $('#view-cart').on('click', viewCart);
  $('#place-order').on('click', processOrder);

});


