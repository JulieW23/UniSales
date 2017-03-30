$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    // Update the user
    $("#search_result_page_search_button").click(function () {
        console.log("Called search_result_page_search_button");
        var price = $("#search_result_page_price").val();
        var category = $("#search_result_page_category").val();
        var name = $("#search_result_page_product_name").val();
        $("#search_result_page_price").val("");
        $("#search_result_page_category").val("");
        $("#search_result_page_product_name").val("");
        searchProduct(price, category, name);
    });  

    function searchProduct(price, category, name) {
        $.ajax({
            url: "/products",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "price": price,
                "category": category,
                "productname": name
            }),
            success: function (response) {
                console.log("Successfully search products")
                console.log(JSON.stringify(response));
                $('#search_box').empty();
                addProducts(response);
            },
            error: function (xhr, status, error) {
                alert(xhr.responseText);
            }
        });
    }

    function addProducts(response)
    {
        $.each(response, function (index, value) {
            console.log(value);
            var div = '<div class="search_result">'
            div += '<img src="img/fake_item.png" alt="item phto" />'
            div += '<h4> Price: ' + value.price +'</h4>'
            div += '<h4> Category: ' + value.category +'</h4>'
            div += '<h4> Name: ' + value.productname +'</h4>'
            div += '</div>';
            console.log(div);
            $("#search_box").append(div);
        });        
    }          
});