const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://Pranu:srikar$123@ds157298.mlab.com:57298/sample-quotes', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3333, () => {
    console.log('listening on 3333')
  })
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  });
});

app.get('/init', (req, res) => {
   res.render("calendar");
  // db.event.insert({
  //   text:"My test event A",
  //   start_date: new Date(2013,8,1),
  //   end_date:   new Date(2013,8,5)
  // });
  // db.event.insert({
  //   text:"One more test event",
  //   start_date: new Date(2013,8,3),
  //   end_date:   new Date(2013,8,8),
  //   color: "#DD8616"
  // });

  /*... skipping similar code for other test events...*/

  res.send("Test events were added to the database")
});

app.post('/init', (req, res) => {
  res.render("calendar");
});


app.put('/quotes', (req, res) => {
  db.collection('quotes').findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
});
