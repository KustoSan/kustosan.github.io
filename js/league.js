// Get URL vars
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

var ranked;

//N Formater
function nFormatter(num) {
     if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
     }
     if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
     }
     if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
     }
     return num;
}

// Function to get game duration
function timeConvert(value) {
  var units = {
    "year": 60 * 24 * 60 * 365,
    "month": 60 * 24 * 60 * 30,
    "day": 60 * 24 * 60,
    "hour": 60 * 60,
    "minute": 60,
    "second": 1,
  }
  var result = []

  for (var name in units) {
    var p = Math.floor(value / units[name]);

    if (p == 1) {
      p = "a";
      if (name == "hour") {
        p = "an"
      }
      result.push(p + " " + name);
    }

    if (p >= 2) result.push(p + " " + name + "s");
    value %= units[name]
  };
  if (result[0] == undefined) {
    result[0] = "seconds"
  }
  return result;
}


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
    var summoner = summoner.split('+').join('');
  }

  var key

  $.getJSON('https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/' + summoner + '?api_key=' + key, function(data) {

    jQuery.each(data, function(i, me) {
      id = this.id
      name = this.name
      profileIconId = this.profileIconId
      summonerLevel = this.summonerLevel
    })

    var website = '//www.lolking.net/summoner/euw/' + id;

    // Appending user data
    $('.header').append('<div class="hb-cover" style="background-position: top; background-image: url(img/project.jpg)">');
    $('.user-info').append('<div class="row hb-row"><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"><div class="hb-avatar" style="background-image: url(http://ddragon.leagueoflegends.com/cdn/5.18.1/img/profileicon/' +
      profileIconId + '.png)"></div></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 icon-col text-right"><div class="hb-avatar tier-icon"></div></div>')
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
      jQuery.each(data.games, function(i, match) {

        if (this.stats.win == true) {
          winLose = '#66BB6A';
          result = "WIN"
        } else {
          winLose = '#EF5350';
          result = "LOSS"
        }

        champId = this.championId;
        gameId = this.gameId;
        if (this.fellowPlayers) {
          playerMatchId = this.fellowPlayers[0].summonerId;
        } else {
          playerMatchId = '0'
        }
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

        if (this.stats.minionsKilled) {
          creeps = this.stats.minionsKilled;
        } else {
          creeps = '0';
        }

        if (this.stats.goldEarned) {
          gold = nFormatter(this.stats.goldEarned);
        } else {
          gold = '0';
        }

        if (this.stats.turretsKilled) {
          turrets = this.stats.turretsKilled;
        } else {
          turrets = '0';
        }

        item0 = this.stats.item0;
        item1 = this.stats.item1;
        item2 = this.stats.item2;
        item3 = this.stats.item3;
        item4 = this.stats.item4;
        item5 = this.stats.item5;
        item6 = this.stats.item6;

        level = this.stats.level;

        gameType = this.subType.split('_').join(' ');
        if (gameType == "NONE") {
          gameType = "CUSTOM";
        }
        gameDuration = timeConvert(this.stats.timePlayed);
        matchDate = new Date(this.createDate).toISOString().slice(0, 10);

        $('.last-matches').append('' +
          '<div class="row hb-row match-row">' +
            '<a target="_blank" href="http://matchhistory.euw.leagueoflegends.com/es/#match-details/EUW1/' + gameId + '/' + playerMatchId + '?tab=overview">' +
              '<div style="border-left: 10px solid' + winLose + ';" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 match-col">' +
                '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 match-content">' +
                  //Game type
                  '<div class="game-type">' +
                    '<h6>' + gameType + '</h6>' +
                  '</div>' +
                  //Game type
                  //Champ image
                  '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 champ-img" style="background-image: url(//lkimg.zamimg.com/shared/images/v2/champions/icons/size100x100/' + champId + '.png)">'+
                  '<div class="champ-level">' +
                  '<p>' + level + '</p>' +
                  '</div>' +
                  '</div>' +
                  //Champ image
                  //Spells images
                  '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 spells-box">' +
                    '<div class="summoner-spell" style="background-image: url(//lkimg.zamimg.com/images/spells/' + spell1 + '.png)"></div>' +
                    '<div class="summoner-spell" style="background-image: url(//lkimg.zamimg.com/images/spells/' + spell2 + '.png)"></div>' +
                  '</div>' +
                  //Spells images
                  //Match Score
                  '<div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 match-score">' +
                    '<p><span class="match-bold">' + kills + '</span> Kills</p>' +
                    '<p><span class="match-bold">' + deaths + '</span> Deaths</p>' +
                    '<p><span class="match-bold">' + assists + '</span> Assists</p>' +
                  '</div>' +
                  //Match Score
                  //Farm Score
                  '<div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 match-score">' +
                    '<p><span class="match-bold">' + gold + '</span> Gold</p>' +
                    '<p><span class="match-bold">' + creeps + '</span> Creeps</p>' +
                    '<p><span class="match-bold">' + turrets + '</span> Turrets</p>' +
                  '</div>' +
                  //Farm Score
                  //Win or Loss
                  '<div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 game-result">' +
                    '<h4 style="color:' + winLose + ';">' + result + '</h4>' +
                  '</div>' +
                  //Win or Loss
                  //Game duration
                  '<div class="col-lg-1 col-md-1 col-sm-2 col-xs-4 game-duration">' +
                    '<h4>' + gameDuration[0] + '</h4>' +
                    '<p class="match-date">(' + matchDate + ')</p>' +
                  '</div>' +
                  //Game duration
                  //Items images
                  '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 items-box">' +
                    '<div class="summoner-item" style="background-image: url(//static-img.kassad.in/item/' + item0 + '.png)"></div>' +
                    '<div class="summoner-item" style="background-image: url(//static-img.kassad.in/item/' + item1 + '.png)"></div>' +
                    '<div class="summoner-item" style="background-image: url(//static-img.kassad.in/item/' + item2 + '.png)"></div>' +
                    '<div class="summoner-item" style="background-image: url(//static-img.kassad.in/item/' + item3 + '.png)"></div>' +
                    '<div class="summoner-item" style="background-image: url(//static-img.kassad.in/item/' + item4 + '.png)"></div>' +
                    '<div class="summoner-item" style="background-image: url(//static-img.kassad.in/item/' + item5 + '.png)"></div>' +
                    '<div class="summoner-item" style="background-image: url(//static-img.kassad.in/item/' + item6 + '.png)"></div>' +
                  '</div>' +
                  //Items images
                '</div>' +
              '</div>' +
            '</a>' +
            '<div class="row hb-row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><hr></div>' +
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
