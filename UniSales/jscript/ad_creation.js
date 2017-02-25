$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    // Main picture upload 
    $('.main_pic_button').on('click', function () {
        console.log("main pic button clicked");
        text = $('.main_photo_url').val();
        $('.main_photo_url').val('');

        // Clear the holder beforehead to make sure that only one
        // main picture is uploaded
        $('.main_picture_holder').empty();
        if (text != undefined) {
            post = '<img src=' + text + '>'
            new_post = $('.main_picture_holder').append($(post));
        }
    });

    // More picture upload
    $('.sub_pic_button').on('click', function () {
        console.log("sub pic button clicked");
        text = $('.sub_photo_url').val();
        $('.sub_photo_url').val('');
        if (text != undefined) {
            post = '<div class="more_pictures_result">'
                + '<img src=' + text + '>'
                + '</div>';
            new_post = $('.more_sub_pictures').append($(post));
        }
    });
});