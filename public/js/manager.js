$(function () {
    const render = function (products, parentId) {
        $(parentId).empty();
        for (let i = 0; i < products.length; i++) {
            $(parentId).append(`<tr>
              <td class="text-center">${products[i].id}</td>
              <td>${products[i].name}</td>
              <td>${products[i].price}</td>
              <td class="text-center">${products[i].avail_quantity}</td>
              </tr>`);
        }
    }

    const displayInventory = function (products, parentId) {
        $(parentId).empty();
        for (let i = 0; i < products.length; i++) {
            $(parentId).append(`<tr>
              <td class="text-center">${products[i].id}</td>
              <td>${products[i].name}</td>
              <td>${products[i].price}</td>
              <td class="text-center">${products[i].avail_quantity}</td>
              <td class="text-center"><input type="text" id="qty${i + 1}"></td>
              <td><button class="btn btn-warning addButton" addId="add${i + 1}" 
                pId="${products[i].id}" pName="${products[i].name}" pPrice="${products[i].price}"
                pDepartment="${products[i].department}" pQty="${products[i].avail_quantity}">
                Add</button></td>
              </tr>`);
        }
    }

    const getSalesProducts = function () {
        $.ajax({
            method: 'GET',
            url: 'api/products'
        }).then(function (res) {
            render(res, '#products-view');
            displayInventory(res, '#replenish-view');
        });
    }
    getSalesProducts();

    const getLowInventory = function () {
        $.get('api/inventories')
            .then(function (data) {
                render(data, '#inventory-view');
            });
    }
    getLowInventory();

    const postProduct = function (event) {
        event.preventDefault();
        const product = {
            name: $('#product').val().trim(),
            department: $('#department').val().trim(),
            price: parseFloat($('#price').val()),
            avail_quantity: parseInt($('#quantity').val())
        }
        $.post('/api/products', product)
            .then(function (data) {
                $('#product').val('');
                $('#department').val('');
                $('#price').val('');
                $('#quantity').val('');
            });
    }
    $('#add-product').on('click', postProduct);

    const showReplenish = function (e) {
        e.preventDefault();
        $('#replenish-order').empty();

        const pId = $(this).attr('pId');
        const pName = $(this).attr('pName');
        const pDepartment = $(this).attr('pDepartment');
        const pPrice = $(this).attr('pPrice');
        const pQty = $(this).attr('pQty');
        const addVal = $(this).attr('addId');
        const qtyVal = `qty${addVal.substring(3)}`;
        const inputQty = $(`#${qtyVal}`).val();
        const totalQty = parseInt(pQty) + parseInt(inputQty);

        const updateProduct = {
            name: pName,
            department: pDepartment,
            price: pPrice,
            avail_quantity: totalQty
          };
        $.ajax({
            method: 'PUT',
            url: `/api/products/${pId}`,
            data: updateProduct
        }).then(function (data) {
            // $('#replenish-order').text(`<h5>Quantity ${inputQty} has been added to Product ${pName}.</h5>`);
            getSalesProducts();
            getLowInventory();
        });
    }
    $(this).on('click', '.addButton', showReplenish);
});

