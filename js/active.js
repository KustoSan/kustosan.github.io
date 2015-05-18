var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/') + 1);

i = 0;
while (i != $('a').length) {
  href = $('a:eq(' + i + ')').attr('href')
  if (href == filename) {
    $('a:eq(' + i + ')').parents('li').addClass('active')
    console.log(filename)
  }
  i++
}

$('.navbar-brand').click(function(event) {
  // stop the click on the link adding a # to the end of the
  event.preventDefault();
});
