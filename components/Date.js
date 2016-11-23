// Written in ES6 so need to run in browser that supports ES6 class declaration.

class MyDate {
  constructor() {
    var d = new Date();
    this.day_of_weekDict = {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat"
    };
    this.monthDict = {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec"
    };
    this.d =  new Date();
    this.year = this.d.getFullYear();
    this.month = this.d.getMonth() + 1;
    this.month_of_year = this.monthDict[this.month]
    this.day = this.d.getDate();
    this.day_of_week = this.day_of_weekDict[this.d.getDay()];
  }

  next() {
    if (this.day === 31) {
      if (this.month === 12) {
        this.month = 0;
      } else {
        this.month+=1;
      }
      this.day = 1;
    } else {
      this.day+=1;
    }
    this.update();
  }

  prev() {
    if (this.day === 1) {
      if (this.month === 0) {
        this.month = 12;
      } else {
        this.month-=1;
      }
      this.day = 31;
    } else {
      this.day-=1;
    }
    this.update();
  }

  update() {
    this.d.setMonth(this.month, this.day);
    this.month_of_year = this.monthDict[this.month];
    this.day_of_week = this.day_of_weekDict[this.d.getDay()];
  }
}
