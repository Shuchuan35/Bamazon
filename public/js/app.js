$(document).ready(function () {
  const purchaseOrder = [];
  let totalPrice = 0;
  const render = function (products) {
    $('#product-details').empty();

    for (let i = 0; i < products.length; i++) {
      // console.log(`${products[i].name}`);
      const productRow = $('<tr>').addClass('productRow');

      const qtyCol = $('<th>');
      qtyCol.append(`<input type="number" min="1" id="qtyRow${i + 1}">`);
      productRow.append(qtyCol);

      const productCol = $('<td>').text(`${products[i].name}`);
      productRow.append(productCol);

      const priceCol = $('<td>').text(`${products[i].price}`);
      productRow.append(priceCol);

      const avilQtyCol = $('<td>').text(`${products[i].avail_quantity}`);
      productRow.append(avilQtyCol);

      const cartButton = $('<button>').addClass('btn btn-warning cart');
      cartButton.attr('cart-name', `cart${i + 1}`);
      cartButton.attr('product-id', `${products[i].id}`);
      cartButton.text('Add to Cart');
      
      const cartCol = $('<td>').append(cartButton);
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

  const calculateOrderTotal = function (price) {
    totalPrice += parseInt(price);
  }

  const updateInventoryQty = function (pId, newData, itemTotal) {
    $.ajax({
      method: 'PUT',
      url: `/api/products/${pId}`,
      data: newData
    }).then(function (data) {
      getAllProducts();
      calculateOrderTotal(itemTotal);
    });
  }

  const fillOrder = function () {
    for (let i = 0; i < purchaseOrder.length; i++) {
      const poId = purchaseOrder[i].id;
      const poQty = purchaseOrder[i].qty;
      const itemTotal = purchaseOrder[i].total;
      $.get(`/api/product/${poId}`)
        .then(function (data) {
          const newQty = parseInt(data.avail_quantity) - parseInt(poQty);
          const newProductData = {
            name: data.name,
            department: data.department,
            price: data.price,
            avail_quantity: newQty
          };
          updateInventoryQty(poId, newProductData, itemTotal);
        });
    }
  }

  const resetPurchaseOrder = function () {
    for (let i = purchaseOrder.length; i > 0; i--) {
      purchaseOrder.pop();
    }
    totalPrice = 0;
  }

  const displayMessage = function () {
    $('#po-results').removeClass('alert alert-danger');
    $('#po-results').addClass('alert alert-info');
    $('#po-results').text(`Thank you for your order! Your order total is $${totalPrice}!`);
    resetPurchaseOrder();
  }

  const processOrder = function (e) {
    e.preventDefault();
    fillOrder();
    setTimeout(displayMessage, 500);
  }
  $('#place-order').on('click', processOrder);


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
  $('#view-cart').on('click', viewCart);

  const insufficientQty = function (qty, qtyVal) {
    $('#po-results').removeClass('alert alert-info');
    $('#po-results').addClass('alert alert-danger');
    $('#po-results').html(`<i class="fa fa-exclamation-circle fa-lg" aria-hidden="true"></i> 
   Insufficient quantity! Product has ${qty} in stock, your ordered ${qtyVal}. 
  Please adjust your order quantity before proceed to check out.`);
  }

  const addPurchaseOrderItem = function (data, productId, qtyVal, purchaseItem) {
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
          qtyVal = parseInt(qtyVal) + parseInt(oldQty);
          if (data.avail_quantity < qtyVal) {
            insufficientQty(data.avail_quantity, qtyVal);
          } else {
            const newTotal = qtyVal * data.price;
            purchaseItem.qty = qtyVal;
            purchaseItem.total = newTotal.toFixed(2);
            purchaseOrder.splice(i, 1, purchaseItem);
          }
        }
      }
    }
  }

  const addCartItem = function (productId, qtyVal) {
    $.get(`/api/product/${productId}`)
      .then(function (data) {
        if (data.avail_quantity < qtyVal) {
          insufficientQty(data.avail_quantity, qtyVal);
        } else {
          const total = qtyVal * data.price;
          const purchaseItem = {
            id: productId,
            qty: qtyVal,
            item: data.name,
            price: data.price,
            total: total.toFixed(2)
          }
          addPurchaseOrderItem(data, productId, qtyVal, purchaseItem);
        }
      });
  }

  const clearMessage = function () {
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
    clearMessage();
    addCartItem(productId, qtyVal);
  }
  $(this).on('click', '.cart', addToCart);
});


