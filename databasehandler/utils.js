const DB = {
  dbname: 'expense.db',
  tables: {
    entries: {
      name: 'entries',
      columns: {
        id: {
          title: 'id',
          type: 'text',
        },
        title: {
          title: 'title',
          type: 'Text',
        },
        description: {
          title: 'description',
          type: 'text',
        },
        amount: {
          title: 'amount',
          type: 'float',
        },
        date: {
          title: 'date',
          type: 'date',
        },
        categoryId: {
          title: 'categoryid',
          type: 'integer',
        },
      },
    },
    categories: {
      name: 'categories',
      columns: {
        id: {
          title: 'id',
          type: 'text',
        },
        title: {
          title: 'title',
          type: 'text',
        },
        type: {
          title: 'type',
          type: 'text',
        },
      },
    },
  },
};

export {DB};
