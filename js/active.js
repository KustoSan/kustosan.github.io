var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/') + 1);

i = 0;
while (i != $('a').length) {
  href = $('a:eq(' + i + ')').attr('href')
  if (href == filename) {
    $('a:eq(' + i + ')').parents('li').addClass('active')
  }
  if (filename == "") {
    $('a:eq(1)').parents('li').addClass('active')
  }
  i++
}

Waves.attach('a');
Waves.init();
