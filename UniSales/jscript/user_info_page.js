$(function () {
    $("#header").load("header.html");
    $("#footer").load("footer.html");

    // Post Comments
    // Main picture upload 
    $('.post_comment_button').on('click', function () {
        console.log("post_comment_button clicked");
        title = $('.comment_title').val();
        detail = $('.comment_detail').val();
        $('.comment_title').val('');
        $('.comment_detail').val('');

        if (title != undefined && detail != undefined) {
            post = '<article class="single_comment">'
                    + '<h3>' + title + '</h3>'
                    + '<p>' + detail + '</p>'
                    + '</article>';
            new_post = $('.uploaded_comments').append($(post));
        }
    });
});