$(document).ready(function () {
  const purchaseOrder = [];
  const render = function (products) {
    // $('#product-details').empty();

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

  const validateOrder = function() {
    console.log('Hi');
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

  const addPurchaseItem = function (productId, qtyVal) {
    $.get(`/api/products/${productId}`)
      .then(function (data) {
        const purchaseItem = {
          id: productId,
          qty: qtyVal,
          item: data.name,
          price: data.price,
          total: qtyVal * data.price
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
    
    addPurchaseItem(productId, qtyVal);
  }

  $(this).on('click', '.cart', addToCart);
  $('#view-cart').on('click', viewCart);
  $('#place-order').on('click', validateOrder);
});









