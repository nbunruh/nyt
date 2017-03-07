var apiKey = "9581bb61678b475aaaa0a810cc2e4249";
// These variables will hold the results we get from the user's inputs via HTML
var searchTerm = "";
var numResults = 0;
var startYear = 0;
var endYear = 0;
// queryURLBase is the start of our API endpoint. The searchTerm will be appended to this when
// the user hits the search button
var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" +
  apiKey + "&q=";

// Added counter to keep track of articles
var articleCounter = 0;

// The launchQuery function will run two parameters:
// The number of articles we want to display and the URL to retrieve the data
function launchQuery(numArticles, queryURL) {
  // We will use the NYTData variable to store the data we receive
  // After we call it using an AJAX function
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(NYTData) {
    //Troubleshoot
    console.log("URL: " + queryURL);
    // Using a for loop to ensure only the amount of results we ask it for are shown
    for (var i = 0; i < numArticles; i++) {
      articleCounter++;
      // This will create the HTML wells where the article(s) will be stored 
      var wellStorage = $("<div>");
      wellStorage.addClass("well");
      wellStorage.attr("id", "article-well-" + articleCounter);
      $("#well-storage").append(wellStorage);
      // Verifies whether or not any of the article(s) JSON is missing
      // This will grab the article(s) headline (if it has one)
      if (NYTData.response.docs[i].headline !== "null") {
        $("#article-well-" + articleCounter)
          .append(
            "<h3 class='articleHeadline'><span class='label label-primary'>" + "</span><strong> " 
            + NYTData.response.docs[i].headline.main + "</strong></h3>"
          );
      }
      // Adds article(s) byline to HTML if it has one
      if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.original) {
        $("#article-well-" + articleCounter)
          .append("<h5>" + NYTData.response.docs[i].byline.original + "</h5>");
      }
      // Display the remaining fields
      $("#article-well" + articleCounter)
        .append("<h5>Section: " + NYTData.response.docs[i].section_name + "</h5>");
      $("#article-well" + articleCounter)
        .append("<h5>" + NYTData.response.docs[i].pub_date + "</h5>");
      $("#article-well" + articleCounter)
        .append(
          "<a href='" + NYTData.response.docs[i].web_url + "'>" +
          NYTData.response.docs[i].web_url + "</a>"
        );
      // Log the remaining fields to console as well
      console.log(NYTData.response.docs[i].pub_date);
      console.log(NYTData.response.docs[i].section_name);
      console.log(NYTData.response.docs[i].web_url);
    }
  });
}

// In the event one of the buttons are clicked, the following method(s) will be executed...
$("#run-search").on("click", function(event) {

  event.preventDefault();
  articleCounter = 0;
  // Empties the well storage area
  $("#well-storage").empty();

  searchTerm = $("#search-term").val().trim();
  var queryURL = queryURLBase + searchTerm;
  // Number of results the user would like displayed
  numResults = $("#num-records-return").val();
  startYear = $("#start-year").val().trim();
  endYear = $("#end-year").val().trim();
  // endYear will be included in the queryURL should the user provide one
  if (parseInt(startYear)) {
    queryURL = queryURL + "&begin_date=" + startYear + "0101";
  }
  // endYear will be included in the queryURL should the user provide one
  if (parseInt(endYear)) {
    queryURL = queryURL + "&end_date=" + endYear + "0101";
  }
  // Then we will pass the final queryURL and the number of results to
  // include to the launchQuery function
  launchQuery(numResults, queryURL);
});
// This button clears all the search results
$("#clear").on("click", function() {
  articleCounter = 0;
  $("#well-storage").empty();
});