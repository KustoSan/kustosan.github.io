// Get URL vars
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

var ranked;

// Loading text
$(document).ajaxStart(function() {
  $('#last-matches').html('<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6 league-loading"><h4 class=""><i class="fa fa-spinner fa-pulse"></i> Loading...</h4>');
})

$(document).ajaxStop(function() {
  $('.league-loading').remove();
})

$(document).ready(function() {

  var summoner = getUrlVars()['summoner']

  if (!summoner) {
    var summoner = 'Kusto'
  } else {
    var summoner = summoner.replace('+', '%20');
  }

  var _0xc2fe = ["\x38\x62\x35\x35\x37\x39\x34\x64\x2D\x66\x64\x37\x36\x2D\x34\x38\x63\x32\x2D\x39\x34\x62\x61\x2D\x62\x30\x34\x33\x34\x37\x32\x30\x39\x33\x30\x62"];
  var key = _0xc2fe[0];

  $.getJSON('https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/' + summoner + '?api_key=' + key, function(data) {

    jQuery.each(data, function(i, me) {
      id = this.id
      name = this.name
      profileIconId = this.profileIconId
      summonerLevel = this.summonerLevel
    })

    var website = '//www.lolking.net/summoner/euw/' + id;

    // Appending user data
    $('.header').append('<div class="hb-cover" style="background-position: top; background-image: url(img/kata.jpg)">');
    $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><div class="hb-avatar" style="background-image: url(//lkimg.zamimg.com/shared/riot/images/profile_icons/profileIcon' +
      profileIconId + '.jpg)"></div></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 icon-col text-right"><div class="hb-avatar tier-icon"></div></div>')
    $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 hb-username"><a target="_blank" href="' + website + '">' + name +
      '</a><p class="hb-website"><a target="_blank" href="' + website + '">' + id + '</a></p></div>' +
      '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right league-info"></div>');
    $('.user-info').append('<div class="row hb-row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><hr></div></div>');
    $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 summoner-info"><p>Level ' + summonerLevel + '</p><p>' +
      'Europe West</p></div><div class="row hb-row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 summoner-info ranked-info text-right"></div>');


    $.getJSON('https://euw.api.pvp.net/api/lol/euw/v2.5/league/by-summoner/' + id + '?api_key=' + key, function(data) {

      jQuery.each(data, function(i, me) {
        data = this
      })

      jQuery.each(data, function(i, me) {
        if (this.queue == 'RANKED_SOLO_5x5') {
          data = this
          ranked = true
        } else {
          return;
        }
      })

      if (ranked == true) {
        tier = data.tier
        leagueName = data.name

        jQuery.each(data.entries, function(i, me) {

          if (me.playerOrTeamId == data.participantId) {
            division = me.division
            image = ('img/tier-icons/tier_icons/' + tier + '_' + division + '.png').toLowerCase()
            league = tier + ' ' + division
            leaguePoints = me.leaguePoints
            wins = me.wins
            losses = me.losses
            wRate = (wins / (wins + losses) * 100).toFixed(2);
            queue = data.queue.split('_').join(' ')
          }
        })

        if (wRate > 50) {
          color = '#66BB6A';
        } else {
          color = '#EF5350';
        }

        // Append ranked info
        $('.tier-icon').css('background-image', 'url(' + image + ')');
        $('.league-info').append('<p class="league-name">' + league + '</p><p>' + leagueName + '</p>')
        $('.league-info').append('<p>' + queue + '</p>')
        $('.ranked-info').append('<p>' + leaguePoints + ' LP</p>')
        $('.ranked-info').append('<p><span style="color:#66BB6A;">' + wins + ' Wins</span> / <span style="color:#EF5350;">' + losses + ' Losses</span> / <span style="color:' + color + ';">(' + wRate + '%)</span></p>')
      }

      // Unranked info
      else {
        $('.tier-icon').css('background-image', 'url(img/tier-icons/base_icons/provisional.png)');
        $('.league-info').append('<p class="league-name">Unranked</p>')
        $('.league-info').append('<p>Position games</p>')
        $('.league-info').append('<p>RANKED SOLO 5x5</p>')
        $('.ranked-info').append('<p>0 LP</p>')
        $('.ranked-info').append('<p><span style="color:#66BB6A;">0 Wins</span> / <span style="color:#EF5350;">0 Losses</span> / <span style="color:#EF5350;">(0%)</span></p>')
      }

    })

    // Unranked on error
    .error(function() {
      $('.tier-icon').css('background-image', 'url(img/tier-icons/base_icons/provisional.png)');
      $('.league-info').append('<p class="league-name">Unranked</p>')
      $('.league-info').append('<p>Position games</p>')
      $('.league-info').append('<p>RANKED SOLO 5x5</p>')
      $('.ranked-info').append('<p>0 LP</p>')
      $('.ranked-info').append('<p><span style="color:#66BB6A;">0 Wins</span> / <span style="color:#EF5350;">0 Losses</span> / <span style="color:#EF5350;">(0%)</span></p>')
    })

    // Matches
    $.getJSON('https://euw.api.pvp.net/api/lol/euw/v1.3/game/by-summoner/' + id + '/recent?api_key=' + key, function(data) {
      console.log(data)
      jQuery.each(data.games, function(i, match) {

        if (this.stats.win == true) {
          winLose = '#66BB6A';
        } else {
          winLose = '#EF5350';
        }

        champId = this.championId;
        gameId = this.gameId;
        playerMatchId = this.fellowPlayers[0].summonerId;
        spell1 = this.spell1;
        spell2 = this.spell2;

        if (this.stats.championsKilled) {
          kills = this.stats.championsKilled;
        } else {
          kills = '0';
        }

        if (this.stats.numDeaths) {
          deaths = this.stats.numDeaths;
        } else {
          deaths = '0';
        }

        if (this.stats.assists) {
          assists = this.stats.assists;
        } else {
          assists = '0';
        }

        $('.last-matches').append('' +
          '<div class="row hb-row match-row">' +
            '<a target="_blank" href="http://matchhistory.euw.leagueoflegends.com/es/#match-details/EUW1/' + gameId + '/' + playerMatchId + '?tab=overview">' +
              '<div style="border-left: 10px solid' + winLose + ';" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 match-col">' +
                '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 match-content">' +
                  '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 champ-img" style="background-image: url(//lkimg.zamimg.com/shared/riot/images/champions/' + champId + '.png)"></div>' +
                  '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 spells-box">' +
                    '<div class="summoner-spell" style="background-image: url(//lkimg.zamimg.com/images/spells/' + spell1 + '.png)"></div>' +
                    '<div class="summoner-spell" style="background-image: url(//lkimg.zamimg.com/images/spells/' + spell2 + '.png)"></div>' +
                  '</div>' +
                  '<div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 match-score">' +
                    '<p>' + kills + ' Kills</p>' +
                    '<p>' + deaths + ' Deaths</p>' +
                    '<p>' + assists + ' Assists</p>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="row hb-row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><hr></div>' +
              '</a>' +
            '</div>')
      })

    })

  })

  // Error message on ajax error
  .error(function() {
    $('#last-matches').html('<div class="col-lg-4 col-md-4 col-sm-4 col-xs-6"><h4><i class="fa fa-warning"></i> Oops, something went wrong...</h4>');
    $('.user-info').css('margin-top', '-25px')
  })

})
