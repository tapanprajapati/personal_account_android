const HeaderColors = {
  background: '#0A89A7',
  titleText: '#fff',
};

const TextColors = {
  income: '#00C63C',
  expense: '#D50000',
};

const ButtonColors = {
  homeButton: {
    income: '#00C63C',
    expense: '#F44336',
    difference: '#00B9E6',
    recent: '#673AB7',
    floating: '#2196F3',
    import: 'white',
    export: 'white',
  },
  floatingAdd: '#0A89A7',
  entryAdd: '#F36C60',
  entryControl: {
    edit: 'steelblue',
    delete: 'steelblue',
  },
};

const ListColors = {
  yearList: {
    title: '#fff',
    background: '#F44336',
    footer: '#758698',
  },
  dateList:{
    title: '#fff',
    background: '#F44336',
    footer: '#758698',
  }
};

const TextBackground = {
  footerTotal: '#FF1744',
  differenceTotal: '#2196F3',
  yearTableTitle: '#2196F3',
  yearTitle: '#F44336',
  savingRed: '#F44336',
  savingGreen: '#00C63C',
};

const Graph = {
  income: '#00C63C',
  expense: '#F44336',
  random: () =>{
      return ("#" + ((1<<24)*Math.random() | 0).toString(16))
  }
}

export {HeaderColors, TextColors, ButtonColors, ListColors, TextBackground, Graph};
