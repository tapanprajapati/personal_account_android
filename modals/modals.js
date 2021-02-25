class Entry {
  constructor() {
    this.type = '';
    this.category = '';
    this.title = '';
    this.details = '';
    this.date = '';
    this.amount = 0;
  }
}

class YearList {
  constructor() {
    this.year = '';
    this.months = [];
  }
}

class DateList {
  constructor() {
    this.date = '';
    this.entries = [];
  }
}

class MonthData {
  constructor() {
    this.month = '';
    this.amount = 0;
  }
}
