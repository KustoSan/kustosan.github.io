// Get URL vars
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      vars[key] = value;
    });
    return vars;
  }
  // Start everything if user is set
$(document).ready(function() {

  $.ajaxSetup({
    cache: false
  });
  var user = getUrlVars()["user"];
  var page = 1;
  if (user != undefined) {
    $('#updateBtn').html('<i class="fa fa-spinner fa-pulse"></i> Loading compatibilities...');
    $('.gprogress').html(user + "'s followed users anime taste compatibility")

    do {
      // Get follow json
      $.jsonp({
        url: 'https://hummingbird.me/users?callback=?&followed_by=' + user + '&page=' + page, // any JSON endpoint
        jsonpSupport: true, // if URL above supports JSONP (optional)
        success: function(data) {

          // Get each follower compatibility
          jQuery.each(data.users, function(a, val) {

            $.getJSON('https://hbird-cmp-node.herokuapp.com/compatibility/anime?user1=' + user + '&user2=' + val.id + '&callback=asd', function(data) {

              $('#members').append('<tr id="ded"><td class="countTd"><b></b></td><td><a style="color:#428bca;" href="https://hummingbird.me/users/' +
                val.id + '" target="_blank"</a>' + val.id + '</td><td>' + data.percent + '</td><td>Followed</td></tr>');
              $('th').removeAttr("data-sorted")
              $('th').removeAttr("data-sorted-direction")
              Sortable.init();
              for (var i = 0; i <= $('.countTd').length; i++) {
                $('.countTd:eq(' + i + ')').html('#' + (i + 1) + ' |');
              };
            })
          })
        }
      });
      page++
    }
    while (page != "100")
  }
});

// When all Ajax requests stop
$(document).ajaxStop(function() {

  $("#updateBtn").html('<i class="fa fa-check"></i> Enjoy! ^o^');
  $(".dedo").click(function() {
    for (var i = 0; i <= $('.countTd').length; i++) {
      $('.countTd:eq(' + i + ')').html('#' + (i + 1) + ' |');
    }
  })
});
