const express = require("express");
const { request } = require("http");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = 8000;

require('dotenv').config();

 let db,
     dbConnectionStr = process.env.DB_STRING,
     dbName = 'tasks';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true})
  .then(client => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  });

// Allows me to see index file as I develop it
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
  db.collection('tasks').find().sort({priority: -1}).toArray()
    .then(data => {
      res.render('index.ejs', {info: data});
    })
    .catch(error => {
      console.error(error);
    })
})

app.post('/addTask', (req, res) => {
  console.log(req);
  db.collection('tasks').insertOne({taskName: req.body.taskName,
  completed: req.body.completed, priority: Number(req.body.priority)})
  .then(result => {
    console.log('Task added');
    res.redirect('/');
  })
  .catch(error => console.error(error));
})

app.put('/addOnePriority', (req, res) => {
  db.collection('tasks').updateOne({
    taskName: req.body.taskNameS,
    completed: req.body.completedS,
    priority: req.body.priorityS
  }, {
    $set: {
      priority: req.body.priorityS + 1
    }
  },
  {
    sort: {_id: -1},
    upsert: true
  })
  .then(result => {
    console.log('Added one to priority');
    res.json('Priority Increased');
  })
  .catch(error => console.error(error));
})

app.put('/removeOnePriority', (req, res) => {
  db.collection('tasks').updateOne({
    taskName: req.body.taskNameS,
    completed: req.body.completedS,
    priority: req.body.priorityS
  }, {
    $set: {
      priority: req.body.priorityS - 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  })
  .then(result => {
    console.log('Removed one from priority');
    res.json('Priority Decreased');
  })
  .catch(error => console.error(error));
})


app.delete('/deleteTask', (req, res) => {
  db.collection('tasks').deleteOne({taskName: req.body.taskNameS})
  .then(result => {
    console.log('Task Deleted');
    res.json('Task Deleted');
  })
  .catch(error => console.error(error));
})


app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
})