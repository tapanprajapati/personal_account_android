module.exports = {
    entry: {
        createEntry: "http://192.168.1.72/api/entry/create",
        getEntries: "http://192.168.1.72/api/entry/",
        getYears: "http://192.168.1.72/api/summary/year",
        getYearTotal: "http://192.168.1.72/api/summary/year/total",
        getMonths: "http://192.168.1.72/api/summary/month",
        getMonthTotal: "http://192.168.1.72/api/summary/month/total",
        getDates: "http://192.168.1.72/api/summary/date",
        getDateTotal: "http://192.168.1.72/api/summary/date/total",
    },
    category: {
        getCategories: "http://192.168.1.72/api/category/"
    }
}