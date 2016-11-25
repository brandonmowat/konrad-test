class ListGame {
  constructor(home_team_name, away_team_name, status, linescore) {
    this.home_team_name = home_team_name || "";
    this.away_team_name = away_team_name || "";
    this.status = status || "";
    this.linescore = linescore || "";
  }

  // Returns a string representation of a DOM object
  render() {
    var htmlDOM = " \
      <div class=\"list-game\"> \
        <div class=\"row\"> \
          <h2 class=\"teamName\">"+ this.home_team_name +"</h2> \
          <h2>"+ (this.linescore?this.linescore.r.home:"") +"</h2> \
        </div> \
        <div class=\"row\"> \
          <h2 class=\"teamName\">"+ this.away_team_name +"</h2> \
          <h2>"+ (this.linescore?this.linescore.r.away:"") +"</h2> \
        </div> \
        <div class=\"row\"><h2>"+ this.status.status +"</h2></div> \
      </div> \
    ";

    return htmlDOM;
  }
}
