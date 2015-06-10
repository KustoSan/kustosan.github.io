$.getJSON('//api.github.com/repos/kustosan/kustosan.github.io/contents/css/imgs', function(data) {

  jQuery.each(data, function(i, image) {

    $('.row').append('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><a href="' + image.path + '" class="popup"><div class="thumbnail gallery-thumbnail"><img class="lazy" data-original="' +
      image.path.replace('imgs', 'thumbnails').replace('.png', '.jpg') + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"><div class="caption"><p>Under testing</p></div></div></a></div>')

  })

});
