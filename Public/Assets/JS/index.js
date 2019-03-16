$(document).ready(function() {
  // Setting a reference to the article-container div where all the dynamic content goes
  // Adding event listners to any dynamic generated "save article"
  // and "scrpae new article" buttons

  var articleContainer = $('.article-container');
  $(document).on('click', '.btn.save', handleArticleSave);
  $(document).on('click', '.scrape-new', handleArticleScrape);
  // Once page is ready, run init page function
  // initPage();

  function initPage() {
    // Empty article container, run AXAJ request for any unsaved headlines
    articleContainer.empty();
    $.get('/api/headlines?saved=false').then(function(data) {
      // if we have headlines, render to page
      if (data && data.length) {
        renderArticles(data);
      }
      // Otherwise render message " No articles"
      else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // This function handles appending HTML containig our article data to page
    // we are passed an array of JSON containing all available articles in our DB
    var articlePanels = [];
    // We pass each article JSON object to createPanel function which returns a bootstrap
    // panel with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class= 'panel-heading'>",
        '<h3>',
        article.headline,
        "<a class='btn btn-success save'>",
        'Save Article',
        '</a>',
        '</h3>',
        '</div>',
        "<div class='panel-body'>",
        artilce.summary,
        '</div>',
        '</div>'
      ].join('')
    );

    panel.data('_id', article._id);

    return panel;
  }

  function renderEmpty() {
    //This function renders HTML to the page explaining there are no articles to view
    // Using a joined array of HTML string data because its easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        '<h4> Uh Oh...No New Articles.</h4>',
        '</div>',
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        '<h3> What would you like to Do?</h3>',
        '</div>',
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go To Saved Articles</a></h4>",
        '</div>',
        '</div>'
      ].join('')
    );
    //Appending this data to page
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    var articleToSave = $(this)
      .parents('.panel')
      .data();
    articleToSave.saved = true;
    //Using Patch Method to update to existing record
    $ajax({
      method: 'PATCH',
      url: '/api/headlines',
      data: articleToSave
      // If successful, mongoose will send back an object containing a key of "ok" with value of 1.
    }).then(function(data) {
      if (data.ok) {
        // Run the initPage function again. This will reload the entire article list
        initPage();
      }
    });
  }

  function handleArticleScrape() {
    $.get('/api/fetch').then(function(data) {
      initPage();
      bootbox.alert(
        "<h3 class='text-center m-top-80'>" + data.message + '</h3>'
      );
    });
  }
});
