/*# Kusto #*/


/*################ Get url vars ################*/
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.split(/#.*/).join('').toLowerCase().replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

function compare(a, b) {

  if (a.last_watched < b.last_watched)
    return 1;
  if (a.last_watched > b.last_watched)
    return -1;
  return 0;
}


/*################ Get user by url var ################*/
$(document).ready(function() {

  $.ajaxSetup({
    cache: false
  });

  $("#search").ready(function() {

    var user = getUrlVars()["user"];
    var status = getUrlVars()["status"];

    if (user == undefined || user == "") {
      user = "Kusto";
    }

    if (status == undefined || status == "") {
      status = "all";
    }

    $('#hb-library').html('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><h4><i class="fa fa-spinner fa-pulse"></i> Loading...</h4>');

    $.jsonp({
      url: 'http://hummingbird.me/api/v1/users/' + user + '?callback=?', // any JSON endpoint
      success: function(data) {

        $('.container-error').removeClass('container-error');

        $('#usersearch').val(data.name);

        if (data.waifu == null || "") {
          data.waifu = "Unknown"
        }
        if (data.location == null || "") {
          data.location = "Unknown"
        }
        if (data.website == null || "") {
          data.website = "Unknown"
        }

        if (data.bio == '') {
          data.bio = "This user has not set any profile details."
        }

        var website = Autolinker.link(data.website).split('</a>').join('</a> •').split(/•$/).join('');
        var bio = data.bio.split('\u2003').join(' ');

        $('#library-title').html(data.name + "'s " + status + " anime library");
        $('#hb-header').html('<div class="hb-cover cover-opacity"></div>');
        $('#hb-header').append('<div class="hb-cover" style="background-image: url(' + data.cover_image + ')"><div class="hb-avatar" style="background-image: url(' + "'" + data.avatar + "'" + ')"></div>');
        $('.hb-info').append('<div class="col-lg-4 col-lg-offset-4 hb-username"><a target="_blank" href=' + '"' + '//hummingbird.me/users/' + data.name + '"' + '>' + data.name + '</a><hr></div>');
        $('.hb-info').append('<div class="col-lg-4 col-lg-offset-4"><pre class="hb-website">' + website + '</pre></div>');
        $('.hb-info').append('<div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-xs-12"><div class="col-lg-3 col-lg-offset-2 col-xs-6"><p class="hb-waifu-husbando"><i class="fa fa-heart waifu"></i> ' + data.waifu +
          '</p></div><div class="col-lg-3 col-lg-offset-2 col-xs-6"><p class="hb-location"><i class="fa fa-home home"></i> ' + data.location + '</p></div></div>');
        $('.hb-info').append('<div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 hb-bio"><p>' + bio + '</p></div>');
      }
    })

    $.jsonp({
        url: 'http://hummingbird.me/api/v1/users/' + user + '/library?status=' + status, // any JSON endpoint
        success: function(library) {

          $('#hb-library').html('');
          if (jQuery.isEmptyObject(library)) {
            $('#hb-library').html('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><p>Empty...</p>')
          }

          library = library.sort(compare)
          jQuery.each(library, function(i, data) {

            if (data.anime.episode_count == null) {
              data.anime.episode_count = "?";
            }
            if (data.rewatched_times == "0") {
              var rewatched = "No";
            } else {
              rewatched = data.rewatched_times + ' times';
            }

            var animeStatus = 'Watched ' + data.episodes_watched + ' of ' + data.anime.episode_count + ' episodes';

            if (data.status == 'plan-to-watch') {
              animeStatus = "Plans to watch"
            }
            if (data.status == 'completed') {
              animeStatus = 'Completed';
            }

            $('#hb-library').append('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><div class="thumbnail"><a target="_blank" href="' + data.anime.url +
              '"><img class="lazy" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-original="' + data.anime.cover_image + '"></a><div class="caption"><h4>' +
              data.anime.title + '</h4><p>' + animeStatus + '</p><p>Rewatched: ' + rewatched + '</p></div></div></div>');
          })
        }
      })
      .error(function() {
        $('#hb-library').html('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-6"><h4><i class="fa fa-warning"></i> Oops, something went wrong...</h4>');
      })

  })
});
