$(document).ready(function() {
  //Getting a reference to the article container div we will be rendering all articles inside of
  var articleContainer = $('.article-container');
  // add event listners to dynamically gereate buttons
  $(document).on('click', '.btn.delete', handleArticleDelete);
  $(document).on('click', '.btn.notes', handleArticleNotes);
  $(document).on('click', '.btn.save', handleNoteSave);
  $(document).on('click', '.btn.note-delete', handleNoteDelete);

  // InitPage kicks eveything off when page is loaded
  initPage();

  function initPage() {
    // Empty article container, run AJAX request for saved headlines
    articleContainer.empty();
    $.get('/api/headlines?saved=true').then(function(data) {
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
    var articlePanals = [];

    for (var i = 0; 1 < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }

    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        '<h3>',
        article.headline,
        "<a class='btn btn-danger delete'>",
        'Delete From Saved',
        '</a>',
        "<a class='btn btn-info notes'>Article Notes</a>",
        '</h3>',
        '</div>',
        "<div class='panel-body'>",
        artile.summary,
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
        '<h4> Uh Oh...No Saved Articles.</h4>',
        '</div>',
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        '<h3> Would you like to Browse Available Articles?</h3>',
        '</div>',
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        '</div>',
        '</div>'
      ].join('')
    );
    //Appending this data to page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    var notesToRender = [];
    var currentNote;
    if (data.notes.length) {
      currentNote = [
        "<li class='list-group-item'>",
        'No notes for this article yet.',
        '</li>'
      ].join('');
      notesToRender.push(currentNote);
    } else {
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            '</li>'
          ].join('')
        );

        currentNote.children('button').data('_id', data.notes[i]._id);

        notesToRender.push(currentNote);
      }
    }
    $('.note-container').append(notesToRender);
  }

  function handleArticleDelete() {
    // Function that handles deleting article headlines
    // Grab Id of article to delete
    var articleToDelete = $(this)
      .parents('.panel')
      .data();

    $.ajax({
      method: 'DELETE',
      url: '/api/headlines/' + articleToDelete._id
    }).then(function(data) {
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleNotes() {
    var currentArticle = $(this)
      .parents('.panel')
      .data();

    $.get('/api/notes/' + currentArticle._id).then(function(data) {
      // Construct our HTML for Modal notes Text

      var modalText = [
        "<div class='container-fluid text-center'>",
        '<h4>Notes for Article: ',
        currentArticle._id,
        '</h4>',
        '<hr />',
        "ul class='list-group note-container'>",
        '</ul>',
        "<textare placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Notes</button>",
        '</div>'
      ].join('');
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };

      $('.btn.save').data('article', noteData);

      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    // This function handles what happens when user saves note
    // Set up variable to hold formatted data about note
    // Grab the note typed in input box
    var noteData;
    var newNote = $('.bootbox-body text area')
      .val()
      .trim();
    // if data is typed into field format it
    // post it to the "api/notes" route and send the formatted noteData as well
    if (newNote) {
      noteData = {
        _id: $(this).data('article')._id,
        noteText: newNote
      };
      $.post('/api/notes', noteData).then(function() {
        bootbox.hide();
      });
    }
  }

  function handleNoteDelete() {
    var noteToDelete = $(this).data('._id');

    $.ajax({
      url: '/api/notes' + noteToDelete,
      method: 'DELETE'
    }).then(function() {
      bootbox.hideAll();
    });
  }
});
