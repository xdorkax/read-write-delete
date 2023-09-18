const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./storage/db.json');
const db = low(adapter);

initDb(db);

function initDb(db) {
  db.defaults({ tasks: [] }).write();
  if (!db.get('tasks').size().value()) {
    db.get('tasks')
      .push({ id: 1, title: 'wash car', isCompleted: false })
      .push({ id: 2, title: 'buy car', isCompleted: false })
      .push({ id: 3, title: 'get money for car', isCompleted: false })
      .push({ id: 4, title: 'save the world', isCompleted: true })
      .write();
  }
}

module.exports = db;
