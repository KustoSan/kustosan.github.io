// By Kusto San


// Get url vars
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/#.*/, '').replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

// Function to sort library
function compare(a, b) {

  if (a.last_watched < b.last_watched)
    return 1;
  if (a.last_watched > b.last_watched)
    return -1;
  return 0;
}

function lifeSpent(value) {
  var units = {
    "year": 24 * 60 * 365,
    "month": 24 * 60 * 30,
    "day": 24 * 60,
    "hour": 60,
    "minute": 1,
  }
  var result = []

  for (var name in units) {
    var p = Math.floor(value / units[name]);
    if (p == 1) result.push(p + " " + name);
    if (p >= 2) result.push(p + " " + name + "s");
    value %= units[name]
  };

  var timeText = "";
  for (var i = 0; i < result.length; i++) {
    if (i == result.length - 1) {
      timeText = timeText + ' and ' + result[i];
    } else if (i == result.length - 2) {
      timeText = timeText + result[i];
    } else {
      timeText = timeText + result[i] + ', ';
    }
  }

  return timeText;
}

// Loading text
$(document).ajaxStart(function() {
  $('#hb-library').html('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><h4><i class="fa fa-spinner fa-pulse"></i> Loading...</h4>');
})

$('#search').submit(function() {
  var formAction = $("#selectsearch").val() == "people" ? "user" : "content";
  $("#search-form").attr("action", "/search/" + formAction);
});

$(document).ready(function() {

  $.ajaxSetup({
    cache: false
  });

  $("#search").ready(function() {

    // Setting url vars
    var user = getUrlVars()['user'];
    var status = getUrlVars()['status'];
    var libraryStatus = getUrlVars()['status'];

    if (status == undefined || status == '') {
      status = 'All';
      libraryStatus = 'All';
    }

    // Setting user and status alt vars
    if (status) {
      status = status.split('+').join('-').toLowerCase();
      libraryStatus = libraryStatus.split('+').join(' ');
      $('#' + status).attr('selected', true)
    }

    if (user == undefined || user == "") {
      user = "Kusto";
    }

    $.jsonp({
      url: 'http://hummingbird.me/api/v1/users/' + user + '?callback=?', // any JSON endpoint
      success: function(data) {

        $('.container-error').removeClass('container-error');

        // Set current user to input text
        $('#usersearch').val(data.name);

        // If user info is not set
        if (data.waifu == null || "") {
          data.waifu = "Kusto"
        }
        if (data.location == null || "") {
          data.location = "Kusto's bed";
        }
        if (data.website == null || "") {
          data.website = "hummingbird.me/users/" + data.name;
        }

        if (data.bio == '') {
          data.bio = "This user loves kusto."
        }

        // Set life spent on anime
        var timeSpent = lifeSpent(data.life_spent_on_anime);

        // Auto detect user websites urls
        var website = Autolinker.link(data.website).split('</a>').join('</a> •').split(/•$/).join('');
        var bio = data.bio.split('\u2003').join(' ');

        // Appending user data
        $('#library-title').html(data.name + "'s " + libraryStatus.toLowerCase() + " anime library");
        $('.header').append('<div class="hb-cover" style="background-image: url(' + data.cover_image + ')">');
        $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-8 col-sm-10 col-xs-12"><div class="hb-avatar" style="background-image: url(' + "'" + data.avatar + "'" + ')"></div></div></div>')
        $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-8 col-sm-10 col-xs-12 hb-username"><a target="_blank" href=' + '"' + '//hummingbird.me/users/' +
          data.name + '"' + '>' + data.name + '</a></div></div>');
        $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-8 col-sm-10 col-xs-12"><p class="hb-website">' + website + '</p></div></div>');
        $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-8 col-sm-10 col-xs-12 waifu-location"><p class="hb-waifu-husbando"><i class="fa fa-heart fa-fw waifu"></i> <a href="//hummingbird.me/anime/' +
          data.waifu_slug + '" target="_blank">' + data.waifu + '</a></p><p class="hb-location"><i class="fa fa-map-marker fa-fw home"></i> ' + data.location + '</p></div></div>');
        $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 hb-bio"><p>' + bio + '</p></div></div>');
        $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 hb-bio"><hr><p><i class="fa fa-eye fa-fw watched"></i> ' + "I've watched " + timeSpent + ' of anime</p></div></div>');
      }
    })

    $.jsonp({
      url: 'http://hummingbird.me/api/v1/users/' + user + '/library?status=' + status, // any JSON endpoint
      success: function(library) {

        // Message is library is empty
        $('#hb-library').html('');
        if (jQuery.isEmptyObject(library)) {
          $('#hb-library').html('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><p><i class="fa fa-frown-o"></i> Empty...</p><br>')
        }

        // Sorting library
        library = library.sort(compare)
        jQuery.each(library, function(i, data) {

          // Setting library anime info
          if (data.anime.episode_count == null) {
            data.anime.episode_count = "?";
          }
          if (data.rewatched_times == "0") {
            var rewatched = "No";
          } else {
            rewatched = data.rewatched_times + ' times';
          }

          var statusText = 'Watched ' + data.episodes_watched + ' of ' + data.anime.episode_count + ' episodes';

          if (data.status == 'plan-to-watch') {
            statusText = "Plans to watch"
          }
          if (data.status == 'completed') {
            statusText = 'Completed';
          }

          // Append user library data
          $('#hb-library').append('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><div class="thumbnail"><a target="_blank" href="' + data.anime.url +
            '"><img class="lazy" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-original="' + data.anime.cover_image + '"></a><div class="caption"><h4>' +
            data.anime.title + '</h4><p>' + statusText + '</p><p>Rewatched: ' + rewatched + '</p></div></div></div>');
        })
      }
    })

    // Error message on ajax error
    .error(function() {
      $('#hb-library').html('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-6"><h4><i class="fa fa-warning"></i> Oops, something went wrong...</h4>');
    })

  })
});
