class Entry {
  constructor() {
    this.id = 0;
    this.category = Category();
    this.title = '';
    this.description = '';
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

class Category {
  constructor() {
    this.id = 0;
    this.title = '';
    this.type = '';
  }
}
