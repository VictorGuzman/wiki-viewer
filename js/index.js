/* Code executed when the DOM is loaded */
$(document).ready(function() {
  // Main Wikipedia search Url
  var searchUrl = 'https://en.wikipedia.org/w/api.php';
  setUpAutoComplete(searchUrl);
  setSearchClick(searchUrl);
  setSearchEnterPress(searchUrl);
});

/* Sets input with autocomplete */
function setUpAutoComplete(searchUrl) {
  $("#search-input").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: searchUrl,
        dataType: 'jsonp',
        data: {
          'action': "opensearch",
          'format': "json",
          'search': request.term
        },
        success: function (data) {
          response(data[1]);
        }
      });
    }
  });
}

/* Calls main getSearchData function on Search click */
function setSearchClick(searchUrl) {
  $("#search-btn").on("click", function() {
    var searchInput = $("#search-input").val();
    if (!searchInput == "") {
      $("#result-panels-wrapper").html("");
      getSearchData(searchUrl, searchInput);
    }
  });
}

/* Calls main getSearchData function on Enter Press */
function setSearchEnterPress(searchUrl) {
  $('#search-input').keydown(function (e){
    if(e.keyCode == 13){
      var searchInput = $(this).val();
      if (!searchInput == "") {
        $("#result-panels-wrapper").html("");
        getSearchData(searchUrl, searchInput);
      }
    }
  });
}

/* Retrieves Wikipedia entries data based on search input */
function getSearchData(searchUrl, searchInput) {
  $.ajax({
    url: searchUrl,
    dataType: 'jsonp',
    data: {
      // API Parameters
      action: 'query',
      format: 'json',
      // Search Generator Params
      generator: 'search',
      gsrsearch: searchInput,
      gsrnamespace: 0,
      gsrlimit: 10,
      // Properties Params
      prop: 'extracts|pageimages',
      exchars: 400,
      exlimit: 'max',
      explaintext: true,
      exintro: true,
      piprop: 'thumbnail',
      pilimit: 'max',
      pithumbsize: 200
    },
    success: function (data) {
      drawWikiResults(data.query.pages);
    }
  });
}

/* Draw retrieved entries into Boostrap panels */
function drawWikiResults(pages) {
  $.each(pages, function(page, data){
    drawArticle(data);
  });
}

/* Draw Article in HTML in a Boostrap panel */
function drawArticle(data) {
  var title = data.title;
  var extract = data.extract;
  var pageId = data.pageid;
  var pageUrl = 'https://en.wikipedia.org/?curid=' + pageId;
  var panelHtml = '<div class="animated fadeIn panel panel-default custom-panel"><div class="panel-heading">'
  panelHtml += '<h2 class="panel-title"><a href="' + pageUrl + '" target="_blank">';
  panelHtml += title;
  panelHtml += '</a></h2></div><div class="panel-body">';
  panelHtml += extract;
  panelHtml += '</div></div>';
  $("#result-panels-wrapper").append(panelHtml);
}