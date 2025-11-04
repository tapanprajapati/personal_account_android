module.exports = {
  user: {
    createUser: "insert into users values ( ? )",
    getUser: "select username from users where username=?",
    getAllUsers: "select username from usergroupmap where groupid=?",
  },
  group: {
    exists: "select * from `groups` where title= ?",
    getGroups:
      "select g.id,g.title from `groups` as g, usergroupmap as map where g.id = map.groupid and map.username= ? ",
    insertIntoGroup: "insert into `groups` values ( ?,? )",
    insertIntoUserGroupMap: "insert into usergroupmap values (?,?)",
    joinGroup:
      "insert into usergroupmap values (?, (select id from `groups` where title=? limit 1))",
    leaveGroup:
      "delete from usergroupmap where username = ? and groupid = (select id from `groups` where title=? limit 1)",
  },
  category: {
    getCategories:
      "select id, title, allowance, type from categories where groupid=? and type=?",
    createCategory: "insert into categories values (?,?,?,?,?)",
    exists: "select * from categories where title=? and type=? and groupid=?",
    updateCategory: "update categories set title=?, allowance=? where id=?",
    transferCategory: "update entries set categoryid=? where categoryid=?",
    deleteCategory: "delete from categories where id = ?",
    deleteEntries: "delete from entries where categoryid=?",
  },
  entry: {
    getEntriesOfDate:
      "select e.id, e.title, e.`description`, e.amount, DATE_FORMAT(e.`date`, '%d') as `date`, e.`date` as fulldate, e.categoryid as cId, e.username, c.title as cTitle, c.type as cType from entries as e,categories as c where e.categoryid=c.id and e.title like ? and DATE_FORMAT(e.`date`, '%m/%Y') = ? and e.categoryid in (?) order by `date`",
    createEntry: "insert into entries values(?,?,?,?,?,?,?)",
    updateEntry:
      "update entries set title = ?, description = ?, amount = ?, date = ?, categoryid = ?, username = ? where id = ?",
    deleteEntry: "delete from entries where id = ?",
    recentEntries:
      "select e.id, e.title, e.`description`, e.amount, DATE_FORMAT(e.`date`, '%Y-%m-%d') as `date`, e.categoryid as cId, e.username, c.title as cTitle, c.type as cType from entries as e,categories as c where e.categoryid=c.id order by e.id desc limit ? ",
  },
  summary: {
    yearTotal:
      "select sum(amount) as total from entries where title like ? and DATE_FORMAT(`date`,'%Y') = ? and categoryid in (?)",
    yearTotalAllCategories:
      "select sum(e.amount) as total from entries as e, categories as c where e.categoryid=c.id and DATE_FORMAT(e.`date`,'%Y') = ? and c.type=? and c.groupid=?",
    monthTotal:
      "select sum(amount) as total from entries where title like ? and DATE_FORMAT(`date`,'%m/%Y') = ? and categoryid in (?)",
    monthTotalAllCategories:
      "select sum(e.amount) as total from entries as e, categories as c where e.categoryid=c.id and DATE_FORMAT(e.`date`,'%m/%Y') = ? and c.type=? and c.groupid=?",
    dateTotal:
      "select sum(amount) as total from entries where title like ? and DATE_FORMAT(`date`,'%d/%m/%Y') = ? and categoryid in (?)",
    getAllYears:
      "select distinct DATE_FORMAT(`date`,'%Y') as year from entries order by year desc",
    getYears:
      "select DATE_FORMAT(`date`,'%Y') as `year`, DATE_FORMAT(`date`,'%m') as `month`, sum(amount) as total from entries where title like ? and categoryid in (?) group by DATE_FORMAT(`date`,'%Y/%m') order BY DATE_FORMAT(`date`,'%Y/%m') desc",
    getAllMonths:
      "select distinct DATE_FORMAT(`date`,'%m') as month from entries where DATE_FORMAT(`date`,'%Y') = ? order by month",
    getMonths:
      "select distinct DATE_FORMAT(`date`,'%m') as month from entries where title like ? and DATE_FORMAT(`date`,'%Y') = ? and categoryid in (?) order by month",
    getDates:
      "select distinct DATE_FORMAT(`date`,'%d') as date from entries where title like ? and DATE_FORMAT(`date`,'%m/%Y') = ? and categoryid in (?) order by date",
    getTypeTotal:
      "select sum(e.amount) as total from entries as e, categories as c where e.categoryid=c.id and c.type = ? and DATE_FORMAT(e.date,'%m/%Y') = ? and c.groupid=?",
    getAllCategoriesTotal:
      "select c.id, c.title, sum(e.amount) as total, c.allowance from categories as c left join (select amount,categoryid from entries) as e on e.categoryid=c.id where type=? and groupid=? group by id",
    getAllCategoriesTotalMonth:
      "select c.id, c.title, sum(e.amount) as total, c.allowance from categories as c left join (select amount,categoryid from entries where DATE_FORMAT(date,'%m/%Y') = ?) as e on e.categoryid=c.id where type=? and groupid=? group by id",
    getAllCategoriesTotalYear:
      "select c.id, c.title, sum(e.amount) as total, c.allowance from categories as c left join (select amount,categoryid from entries where DATE_FORMAT(date,'%Y') = ?) as e on e.categoryid=c.id where type=? and groupid=? group by id",
    getDifferenceData:
      `SELECT
          EXTRACT(YEAR FROM t.date) AS year,
          LPAD(EXTRACT(MONTH FROM t.date), 2, '0') AS month,
          SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) AS expenseTotal,
          SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) AS incomeTotal
        FROM entries t
        JOIN categories c ON t.categoryid = c.id
        WHERE
          (c.type = 'expense' AND c.id IN (?))
            OR
            (c.type = 'income' AND c.id IN (?))
        GROUP BY
          EXTRACT(YEAR FROM t.date),
          EXTRACT(MONTH FROM t.date)
        ORDER BY
          year DESC,
          month;`
  },
  recurring: {
    createRecurring: 
    "insert into recurring value (?,?,?,?,?,?,?,?,?,?);",
    getRecurrings:
    "select * from recurring;",
    deleteRecurring: "delete from recurring where id = ?",
  }
};
