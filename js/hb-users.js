/*# Kusto #*/


/*################ Get url vars ################*/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}


/*################ Get user by url var ################*/
$(document).ready(function () {
    $("#search").ready(function () {

        var user = getUrlVars()["user"];
        var status = getUrlVars()["status"];

        if (user == undefined || user == "") {
            user = "kusto";
        }

        if (status == undefined || status == "" || status == "undefined") {
            status = "completed";
        }

		$.jsonp({
				url: 'http://hummingbird.me/api/v1/users/' + user, // any JSON endpoint
				jsonpSupport: true, // if URL above supports JSONP (optional)
				success: function (data){
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
		            $('#h1-library').append(data.name + "'s " + '<span class="label label-primary">' + status + '</span>' + " anime library");
		            $('#hb-header').html('<div class="hb-cover cover-opacity"></div><div class="hb-cover" style="background-image: url(' + data.cover_image + ')"</div>');
		            $('#hb-header').append('<img class="hb-avatar" ' + 'src=' + '"' + data.avatar + '"' + '</img>');
		            $('#hb-biobox').append('<p class="hb-username"><a target="_blank" href=' + '"' + '//hummingbird.me/users/' + data.name + '"' + '>' + data.name + '</a></p>');
		            $('#hb-biobox').append('<p class="hb-bio">' + data.bio + '</p>');
		            $('#hb-info').append('<i class="fa fa-heart waifu"></i><p class="hb-waifu-husbando">' + data.waifu + ' </p>');
		            $('#hb-info').append('<i class="fa fa-home home"></i><p class="hb-location"> ' + data.location + '</p>');
		            $('#hb-info').append('<p class="hb-website"><i class="fa fa-link"></i> ' + data.website + '</p>');
		        }
		})

		$.jsonp({
				url: 'http://hummingbird.me/api/v1/users/' + user + '/library?status=' + status, // any JSON endpoint
				jsonpSupport: true, // if URL above supports JSONP (optional)
				success: function (library){

		            if (jQuery.isEmptyObject(library)) {
		                $('#h1-library').html("<h1>This library is empty D:")
		            }

		            var i = 0;
		            if (library[i] != undefined) {
		                while (library[i] != undefined) {
		                    $('#hb-library').append('<div class="col-md-3 column"><a target="_blank" href="' + library[i].anime.url + '"><figure class="g-figures"><img class="g-images" alt="1920x1080" src="' + library[i].anime.cover_image + '"><figcaption class="g-figcaptions">' + library[i].anime.title + '</figcaption></a></figure></a></div>');
		                    i++;
		                }
		            }
	        	}
        })
    	
	})
});
