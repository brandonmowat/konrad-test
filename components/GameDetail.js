class GameDetail {
  constructor(data) {
    this.home_team_city = data.home_team_city;
    this.away_team_city = data.away_team_city;
    this.data = data;
  }

  /**
  * injectPlayerData - renders the selected team data in the playerData DOM el.
  * @param {Int} - the selected team to render
  */
  injectPlayerData(team) {
    document.getElementById("playerData").innerHTML = this.renderPlayerData(this.playerData, team);
    // bold the switch
    var home = document.getElementById("home_switch");
    var away = document.getElementById("away_switch");
    switch (team) {
      case 0:
        if (home.classList.value != "bold") {
          home.classList.toggle("bold")
          away.classList.toggle("bold")
        }
        break;
      case 1:
        if (away.classList.value != "bold") {
          home.classList.toggle("bold")
          away.classList.toggle("bold")
        }
        break;
      default:
    }
  }

  /**
  * setPlayerDataEventListeners
  */
  setPlayerDataEventListeners() {
    document.getElementById("home_switch").addEventListener("click", this.injectPlayerData.bind(this, 0));
    document.getElementById("away_switch").addEventListener("click", this.injectPlayerData.bind(this, 1));
  }

  getBoxScoreData() {
    var self = this;
    var url = "http://gd2.mlb.com"+ this.data.game_data_directory +"/boxscore.json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        //console.log(JSON.parse(xhr.response));
        console.log(self);
        document.getElementById("playerData").innerHTML = self.renderPlayerData(JSON.parse(xhr.response), 0);
        self.setPlayerDataEventListeners();
      } else {
        document.getElementById("playerData").innerHTML = "Loading Player Data";
      }
    };
    xhr.send();
  }

  renderInningHeader() {
    var scoreHeaders = this.data.linescore.inning.reduce(function(acc, curr, i) {
      return acc+" \
        <div class=\"score headers\">"+ (i+1) +"</div>\
      ";
    }, "");
    return scoreHeaders;
  }

  renderScores(team) {
    var scores = this.data.linescore.inning.reduce(function(acc, curr) {
      return acc+" \
        <div class=\"score\">"+ (curr[team]?curr[team]:"") +"</div>\
      ";
    }, "");

    return scores;
  }

  renderPlayerData(data, team) {
    var batters = data.data.boxscore.batting[team].batter;
    this.playerData = data; // save for good measure
    console.log(batters, team);
    var playerDataRows = batters.reduce(function(acc, curr) {
      return acc + "\
        <div class=\"playerDataRow\">\
          <div class=\"playerName row\">\
            "+ curr.name +"\
          </div>\
          <div class=\"playerData row\">\
            <p>"+ curr.ab +"</p>\
            <p>"+ curr.r +"</p>\
            <p>"+ curr.h +"</p>\
            <p>"+ curr.rbi +"</p>\
            <p>"+ curr.bb +"</p>\
            <p>"+ curr.so +"</p>\
            <p class=\"avg\">"+ curr.avg +"</p>\
          </div>\
        </div>\
      ";
    }, "");
    return playerDataRows;
  }

  render() {
    this.getBoxScoreData();
    var htmlDOM = "\
      <div class=\"detail\"> \
        <h2 class=\"back\"><a href=\"#\" id=\"GoBack\">< go back</a></h2> \
        <div> \
          <div class=\"row\"> \
            <h2 class=\"team\"></h2> \
            "+this.renderInningHeader()+" \
            <div class=\"other_data\">R</div>\
            <div class=\"other_data\">H</div>\
            <div class=\"other_data\">E</div>\
          </div> \
          <div class=\"row\"> \
            <h2 class=\"team\">"+ this.data.home_name_abbrev +"</h2> \
            "+this.renderScores("home")+" \
            <div class=\"other_data\">"+ this.data.linescore.r.home +"</div>\
            <div class=\"other_data\">"+ this.data.linescore.h.home +"</div>\
            <div class=\"other_data\">"+ this.data.linescore.e.home +"</div>\
          </div> \
          <div class=\"row\"> \
            <h2 class=\"team\">"+ this.data.away_name_abbrev +"</h2> \
            "+this.renderScores("away")+" \
            <div class=\"other_data\">"+ this.data.linescore.r.away +"</div>\
            <div class=\"other_data\">"+ this.data.linescore.h.away +"</div>\
            <div class=\"other_data\">"+ this.data.linescore.e.away +"</div>\
          </div> \
        </div> \
        <div class=\"row team_switch\"> \
          <h2 id=\"home_switch\" class=\"bold\">"+ this.home_team_city +"</h2> \
          <h2>|</h2>\
          <h2 id=\"away_switch\">"+ this.away_team_city +"</h2> \
        </div> \
        <div class=\"playerDataRow headers\">\
          <div class=\"playerName row\">\
            Name\
          </div>\
          <div class=\"playerData row\">\
            <p>AB</p>\
            <p>R</p>\
            <p>H</p>\
            <p>RBI</p>\
            <p>BB</p>\
            <p>SO</p>\
            <p class=\"avg\">AVG</p>\
          </div>\
        </div>\
        <div id=\"playerData\"></div>\
      </div> \
    ";
    return htmlDOM;
  }
}
