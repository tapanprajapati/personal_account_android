const host = `192.168.1.72`;

const api = {
  category: {
    getByType: `http://${host}/api/category/1640932481964?type=`,
    create: `http://${host}/api/category/create/`,
    rename: `http://${host}/api/category/rename/`,
    delete: `http://${host}/api/category/`,
    transfer: `http://${host}/api/category/transfer/`
  },
  entry: {
    getEntries: `http://${host}/api/entry?`,
    createEntry: `http://${host}/api/entry/create/`,
    updateEntry: `http://${host}/api/entry/update/`,
    deleteEntry: `http://${host}/api/entry/`,
  },
  summary: {
    getYears: `http://${host}/api/summary/year?`,
    getAllYears: `http://${host}/api/summary/year/all`,
    getYearTotal: `http://${host}/api/summary/year/total?`,
    getMonths: `http://${host}/api/summary/month?`,
    getAllMonths: `http://${host}/api/summary/month/all?`,
    getMonthTotal: `http://${host}/api/summary/month/total?`,
    getDates: `http://${host}/api/summary/date?`,
    getDateTotal: `http://${host}/api/summary/date/total?`,
    getTypeTotal: `http://${host}/api/summary/total/`,
    getAllCategoriesTotal: `http://${host}/api/summary/category/all/total/`,
  },
  user: {
    getAllUsers: `http://${host}/api/user?`
  }
};

export default api;
