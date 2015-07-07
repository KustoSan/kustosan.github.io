$(document).ready(function() {

  var images = []
  for (var i = 105; i >= 0; i--) {
    images.push(i + '.png');
  }

  original = 'https://googledrive.com/host/0B4CDzpF5TN3gfnZmcTc4QmNqeVFJY0ZoWlhJQVR6MGh3U0hnbjRLMWJaRXFrSlBnVTlIWEk/original/'
  thumbnails = 'https://googledrive.com/host/0B4CDzpF5TN3gfnZmcTc4QmNqeVFJY0ZoWlhJQVR6MGh3U0hnbjRLMWJaRXFrSlBnVTlIWEk/thumbnails/'

  jQuery.each(images, function(i, image) {

    $('.row').append('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><a href="' + original + image + '" class="popup"><div class="thumbnail gallery-thumbnail"><img class="lazy" data-original="' +
      thumbnails + image.replace('.png', '.jpg') + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"></div></a></div>')

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

  /*jQuery.each(images, function(i, image) {

    var tempImage1 = new Image();
    tempImage1.src =  original + image;
    tempImage1.onload = function() {
      $('.' + i).html(tempImage1.width + 'x' + tempImage1.height);
    }

  })*/

})
