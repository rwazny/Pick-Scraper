module.exports = function(router) {
  //This route renders the HomePage
  router.get('/', function(req, res) {
    res.render('home');
  });
  // This route is for Saved Handlebars
  router.get('/saved', function(req, res) {
    res.render('saved');
  });
};
