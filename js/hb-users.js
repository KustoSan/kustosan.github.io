/*# Kusto #*/


/*################ Get url vars ################*/
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
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

    if (status == undefined || status == "" || status == "undefined") {
      status = "All";
    }

    $('#default-option').html(status);
    status = status.toLowerCase();

    $.jsonp({
      url: 'http://hummingbird.me/api/v1/users/' + user + '?callback=?', // any JSON endpoint
      jsonpSupport: true, // if URL above supports JSONP (optional)
      success: function(data) {
        document.getElementById('usersearch').value = data.name;
        if (data.waifu == null) {
          data.waifu = "Unknown"
        }
        if (data.location == null) {
          data.location = "Unknown"
        }
        if (data.website == null) {
          data.website = "Unknown"
        }

        var website = Autolinker.link(data.website).split('</a>').join('</a> •').split(/•$/).join('');
        var bio = data.bio.split('\u2003').join(' ');

        $('#library-title').html(data.name + "'s " + status + " anime library");
        $('#hb-header').html('<div class="hb-cover cover-opacity"></div>');
        $('#hb-header').append('<div class="hb-cover" style="background-image: url(' + data.cover_image + ')"><div class="hb-avatar" style="background-image: url(' + "'" + data.avatar + "'" + ')"></div>');
        //$('#hb-header').append('');
        $('.hb-info').append('<div class="col-lg-4 col-lg-offset-4 hb-username"><a target="_blank" href=' + '"' + '//hummingbird.me/users/' + data.name + '"' + '>'+ data.name + '</a><hr></div>');
        $('.hb-info').append('<div class="col-lg-4 col-lg-offset-4"><pre class="hb-website">' + website + '</pre></div>');
        $('.hb-info').append('<div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-xs-12"><div class="col-lg-3 col-lg-offset-2 col-xs-6"><p class="hb-waifu-husbando"><i class="fa fa-heart waifu"></i> ' + data.waifu +
         '</p></div><div class="col-lg-3 col-lg-offset-2 col-xs-6"><p class="hb-location"><i class="fa fa-home home"></i> ' + data.location + '</p></div></div>');
        //$('.hb-info').append('');
          $('.hb-info').append('<div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1 hb-bio"><p>' + bio + '</p></div>');
      }
    })

    $.jsonp({
      url: 'http://hummingbird.me/api/v1/users/' + user + '/library?status=' + status, // any JSON endpoint
      jsonpSupport: true, // if URL above supports JSONP (optional)
      success: function(library) {

        if (jQuery.isEmptyObject(library)) {
          $('#hb-library').append('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><p>Empty...</p>')
        }

        var i = 0;
        if (library[i] != undefined) {
          while (library[i] != undefined) {
            var rewatched = library[i].rewatched_times + ' times';
            if (library[i].rewatched_times == "0") {
              rewatched = "No";
            }
            $('#hb-library').append('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6"><a target="_blank" href="' + library[i].anime.url + '"><div class="thumbnail"><img src="' + library[i].anime.cover_image + '"></a><div class="caption"><h4>' +
              library[i].anime.title + '</h4><p>Watched ' + library[i].episodes_watched + ' of ' + library[i].anime.episode_count + ' episodes</p><p>Rewatched: ' + rewatched + '</p></div></div></a></div>');
            i++;
          }
        }
      }
    })
  })
});
