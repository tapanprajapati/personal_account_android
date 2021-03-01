import {openDatabase} from 'react-native-sqlite-storage';
import {DB} from './utils';

export default function checkAndCreateDatabase() {
  const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${DB.tables.entries.name}' OR name='${DB.tables.categories.name}' `;

  var db = openDatabase({name: DB.dbname});

  db.transaction((tx) => {
    tx.executeSql(sql, [], (t, result) => {
      if (result.rows.length == 0) {
        const dropEntries = `DROP TABLE IF EXISTS ${DB.tables.entries.name}`;
        const dropCats = `DROP TABLE IF EXISTS ${DB.tables.categories.name}`;
        t.executeSql(dropEntries, [], null, null);
        t.executeSql(dropCats, [], null, null);

        const tableE = DB.tables.entries;
        const tableC = DB.tables.categories;
        const createEntries = `CREATE TABLE ${tableE.name} (
        ${tableE.columns.id.title} ${tableE.columns.id.type} PRIMARY KEY AUTOINCREMENT,
        ${tableE.columns.title.title} ${tableE.columns.title.type},
        ${tableE.columns.description.title} ${tableE.columns.description.type},
        ${tableE.columns.amount.title} ${tableE.columns.amount.type},
        ${tableE.columns.date.title} ${tableE.columns.date.type},
        ${tableE.columns.categoryId.title} ${tableE.columns.categoryId.type}
      );`;

        const createCats = `CREATE TABLE ${tableC.name} (
        ${tableC.columns.id.title} ${tableC.columns.id.type} PRIMARY KEY AUTOINCREMENT,
        ${tableC.columns.title.title} ${tableC.columns.title.type},
        ${tableC.columns.type.title} ${tableC.columns.type.type}
      );`;

        t.executeSql(
          createEntries,
          [],
          (ta, res) => {
            console.log(res);
          },
          (ta, err) => {
            console.log(err);
          },
        );
        t.executeSql(
          createCats,
          [],
          (ta, res) => {
            console.log(res);
          },
          (ta, err) => {
            console.log(err);
          },
        );
        console.log('TABLES CREATED');
      } else {
        console.log('TABLES EXISTS');
      }
    });
  });
}
