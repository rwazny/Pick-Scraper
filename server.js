//Require Dependencies
var express = require('express');
var mongoose = require('mongoose');
var expressHandlebars = require('express-handlebars');
var handlebars = require('handlebars');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
// var dateFormat = require('dateFormat');

// Set up port 3000
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Set Up Express Router
var router = express.Router();

//Require our routes file pass our router object
require('./config/route')(router);

//Designate our Public folder as static directory
app.use(express.static('Public'));

//Connect handlebars to Express app
app.engine(
  'handlebars',
  expressHandlebars({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//Use bodyParser in App
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//Have every request go through our Middleware
app.use(router);

//If deployed, used the deployed database. Otherwise use local MongoHeadlines
var db = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// Conect mongoose to our DB
mongoose.connect(db, function(error) {
  if (error) {
    console.log(error);
  } else {
    console.log('Mongoose connection Successful');
  }
});

// // Our scraping tools
// // Axios is a promised-based http library, similar to jQuery's Ajax method
// // It works on the client and on the server
// var axios = require('axios');
// var cheerio = require('cheerio');

// var databaseUrl = 'scraper';
// var collections = ['scrapedData'];

// var db = mongojs(databaseUrl, collections);
// db.on('error', function(error) {
//   console.log('Database Error:', error);
// });

// app.get('/', function(req, res) {
//   res.send('Hello World');
// });

// // // Use morgan logger for logging requests
// // app.use(logger('dev'));
// // Parse request body as JSON
// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.json());
// // // Make public a static folder
// // app.use(express.static('public'));

// // Connect to the Mongo DB
// mongoose.connect('mongodb://localhost/unit18Populater', {
//   useNewUrlParser: true
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get('/articles/:id', function(req, res) {
//   // TODO
//   // ====
//   // Finish the roerute so it finds one article using the req.params.id,
//   // and run the populate method with "note",
//   // then responds with the article with the note included
// });

app.get('/scrape', function(req, res) {
  request('https://www.ultimate-guitar.com/news/', function(
    err,
    resonse,
    body
  ) {
    var $ = cheerio.load(body);

    var articles = [];

    $('section.ug-featured--body').each(function(i, element) {
      console.log(element);
    });
  });
});

// // Route for saving/updating an Article's associated Note
// app.post('/articles/:id', function(req, res) {
//   // TODO
//   // ====
//   // save the new note that gets posted to the Notes collection
//   // then find an article from the req.params.id
//   // and update it's "note" property with the _id of the new note
// });

// Start the server
app.listen(PORT, function() {
  console.log('App running on port ' + PORT + '!');
});
