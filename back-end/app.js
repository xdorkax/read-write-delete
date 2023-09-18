const express = require('express');
const cors = require('cors');
const db = require('./storage/file-database');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/tasks', (req, res) => {
  res.send(db.get('tasks').value());
});

app.get('/tasks/filter/', (req, res) => {
  const allTasks = db.get('tasks').value();
  const filteredTasks = allTasks.filter((item) => {
    return item.title.includes(req.query.name);
  });

  res.send(filteredTasks);
});

app.post('/tasks', (req, res) => {
  let id; 
  try { 
    id = db .get('tasks') 
    .value() 
    .reduce((a, b) => (a.id > b.id ? a : b))
    .id + 1; 
  } catch { id = 1; }
  const response = db
    .get('tasks')
    .push({ id: id, title: req.body.title, isCompleted: false })
    .write();
  res.send({status: "added task"})
});

app.patch('/tasks/:id/status', (req, res) => {
  const response = db
    .get('tasks')
    .find({ id: parseInt(req.params.id) })
    .assign({ isCompleted: req.body.isCompleted })
    .write();

  res.send(response);
});

app.delete('/tasks/:id', function (req, res) {
  const response = db
    .get('tasks')
    .remove((item) => {
      return item.id === parseInt(req.params.id);
    })
    .write();
  res.send(response);
});

const port = 6789;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});