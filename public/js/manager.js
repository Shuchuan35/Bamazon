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

    const getSalesProducts = function () {
        $.ajax({
            method: 'GET',
            url: 'api/products'
        }).then(function (res) {
            render(res, '#products-view');
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
});

