// Server Routes

// Bring Scrape function to scripts directory

var scrape = require('../scripts/scrape');

//Bring headlines and notes from controller
var headlinesController = require('../controllers/headlines');
var notesController = require('../controllers/notes');

module.exports = function(router) {
  router.get('/', function(router) {
    res.render('home');
  });
  router.get('/saved', function(req, res) {
    res.render('saved');
  });

  router.get('/api/fetch', function(req, res) {
    headlinesController.fetch(function(err, docs) {
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: 'No new articles today'
        });
      } else {
        res.json({
          message: 'Added' + docs.insertedCount + 'new articles!'
        });
      }
    });
  });
  router.get('/api/headlines', function(req, res) {
    var query = {};
    if (req.query.saved) {
      query = req.query;
    }
    headlinesController.get(query, function(data) {
      res.jason(data);
    });
  });
  router.delete('/api/headlines/id', function(req, res) {
    var query = {};
    query._id = req.params.id;
    headlinesController.delete(query, function(err, data) {
      res.jason(data);
    });
  });

  router.patch('/api/headlines', function(req, res) {
    headlinesController.update(req.body, function(err, data) {
      res.jason(data);
    });
  });
  router.get('/api/notes/:headlines/id?', function(req, res) {
    var query = {};
    if (req.params.headline_id) {
      query._id = req.params.headline_id;
    }
    notesController.get(query, function(err, data) {
      res.jason(data);
    });
  });
  router.delete('/api/notes/:id', function(req, res) {
    var query = {};
    query._id = req.params.headline_id;
    notesController.delete(query, function(err, data) {
      res.jason(data);
    });
  });
  router.post('/api/notes', function(req, res) {
    notesController.save(req.body, function(data) {
      res.jason(data);
    });
  });
};

// module.exports = function(router) {
//   //This route renders the HomePage
//   router.get('/', function(req, res) {
//     res.render('home');
//   });
//   // This route is for Saved Handlebars
//   router.get('/saved', function(req, res) {
//     res.render('saved');
//   });
// };
