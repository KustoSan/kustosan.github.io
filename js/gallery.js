$(document).ready(function() {

  jQuery.get('css/imgs/files.txt', function(data) {

    var numb = data;
    var images = []

    for (var i = numb; i >= 0; i--) {
      images.push(i + '.png');
    }

    jQuery.each(images, function(i, image) {

      $('.row').append('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><a href="' + 'css/imgs/' + image + '" class="popup"><div class="thumbnail gallery-thumbnail"><img class="lazy" data-original="' +
        'css/thumbnails/' + image.replace('.png', '.jpg') + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"><div class="caption"><p class="' + i + '">Under testing</p></div></div></a></div>')
/*
      var tempImage1 = new Image();
      tempImage1.src = 'css/imgs/' + image;
      tempImage1.onload = function() {
        $('.' + i).html(tempImage1.width + 'x' + tempImage1.height);
      }
*/
    })

    $(".lazy").lazyload({
      effect: "fadeIn",
      threshold: 800
    });
    $('.popup, .mfp-img').magnificPopup({
      type: 'image'
    });
    $("img").error(function hide() {
      $(this).hide();
    });

  });

})
