//var request = require('request');
//var request = cheerio('cheerio');

var scrape = function(cb) {
  request('https://www.ultimate-guitar.com/news/'),
    function(err, res, body) {
      var $ = cheerio.load(body);

      var articles = [];

      $('section.ug-featured--body').each(function(i, element) {
        console.log(element);
      });
    };

 
};
