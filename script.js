"use strict";

// Initialize
var myDate = new MyDate();
document.getElementById("date").innerHTML = myDate.day_of_week + " " + myDate.month_of_year + " " + myDate.day + " " + myDate.year;
// Get our favourite team. If it's not initialized yet: set it to Blue Jays.
var fav_team = localStorage.getItem("fav_team");
if (!fav_team) {
  localStorage.setItem("fav_team", "Blue Jays");
  var fav_team = "Blue Jays";
  document.getElementById("fav_team").innerHTML = fav_team;
} else {
  document.getElementById("fav_team").innerHTML = fav_team;
}

// get today's data
getData(myDate.year, myDate.month, myDate.day);

// Set date event handlers
document.getElementById("nextButton").addEventListener("click", nextDate);
document.getElementById("prevButton").addEventListener("click", prevDate);

/**
* setFavTeam - sets a new favourite team and re-renders todays data
* @param {String} the new favourite team.
*/
function setFavTeam(team) {
  localStorage.setItem("fav_team", team);
  fav_team = team;
  document.getElementById("fav_team").innerHTML = fav_team;
  // uncomment following line to force back to list game view
  //getData(myDate.year, myDate.month, myDate.day);
}

/**
* gamesTableEventHandler - Set event listeners and handle game table events
* @param {Object} 
*/
function gamesTableEventHandler(data) {
  var games = document.getElementsByClassName("list-game"); // Get the games
  for (var i = 0; i < games.length; i++) {
    // Add click event listeners to each element
    games[i].addEventListener("click", showDetailView.bind(this, i, data));

    // set event listeners to set new fav team.
    var teams = games[i].getElementsByClassName("teamName");
    for (var j = 0; j < teams.length; j++) {
      teams[j].addEventListener("click", setFavTeam.bind(this, teams[j].innerHTML));
    }
  }
}

// Render the detail view
function showDetailView(i, data) {
  // render detail with data
  if (data.game) {
    if (Array.isArray(data.game)) {
      var DetailView = new GameDetail(data.game[i]);
    } else {
      var DetailView = new GameDetail(data.game);
    }
    document.getElementById("content").innerHTML = DetailView.render();
    document.getElementById("GoBack").addEventListener("click", goBack);
  }
}

// Handle transition to next date
function nextDate() {
  myDate.next();
  getData(myDate.year, myDate.month, myDate.day);
  document.getElementById("date").innerHTML = myDate.day_of_week + " " + myDate.month_of_year + " " + myDate.day + " " + myDate.year;
}

// Handle transition to previous date
function prevDate() {
  myDate.prev();
  getData(myDate.year, myDate.month, myDate.day);
  document.getElementById("date").innerHTML = myDate.day_of_week + " " + myDate.month_of_year + " " + myDate.day + " " + myDate.year;
}

// go back to list view
function goBack() {
  getData(myDate.year, myDate.month, myDate.day); //
}

/**
* getData: Fetches data, then handles it accordingly...
*
* @param {Number} a year
* @param {Number} a month
* @param {Number} a day
*/
function getData(year, month, day) {
  console.log(year, month, day);
  if (!(year && month && day)) {
    throw "year, month, and day are required parameters in getData()";
    return false;
  }
  if (day < 10) {
    day = "0"+day;
  }
  if (month < 10) {
    month = "0"+month;
  }

  var url = "http://gd2.mlb.com/components/game/mlb/year_" + year +
    "/month_" + month +
    "/day_" + day + "/master_scoreboard.json";

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log(JSON.parse(xhr.response));
      document.getElementById("content").innerHTML = renderGames(JSON.parse(xhr.response));
      gamesTableEventHandler(JSON.parse(xhr.response).data.games);
    }
  };
  xhr.send();
}

/**
* renderGames: Renders the table of games
* @param {Object} data from MLB
*/
function renderGames(data) {
  var games = data.data.games.game;
  if (games) {
    if (Array.isArray(games)) {
      var games_table = games.map(function(curr) {
        return (
          new ListGame(curr.home_team_name, curr.away_team_name, curr.status, curr.linescore).render()
        );
      });
      return games_table.reduce(function(acc, curr) {
        console.log(localStorage.getItem("fav_team"));
        if (curr.includes(fav_team)) {
          return curr+acc; // put fave team at the top
        } else {
          return acc+curr;
        }
      }, "");
    }
    else if (games.constructor.name === 'Object') {
      return (
        new ListGame(games.home_team_name, games.away_team_name, games.status, games.linescore).render()
      );
    }
  }
  else {
    return "<h2 class=\"text-center\">No Games today.</h2>"
  }
}

/**
* renderDetail - renders the detail view
*
* @param {Object} data to render detail for
*/
function renderDetailView(data) {

}
