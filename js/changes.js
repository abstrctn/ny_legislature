function load_committee_list(year, chamber) {
  var endpoint = ENDPOINTS.committees_by_chamber(year, chamber);
  ENDPOINTS.call(endpoint, function(data) {
    var chamber_nav = $('.sidenav .' + chamber);
    var committees = data.contents.results[0].committees;

    for (var i=0; i < committees.length; i++) {
      var committee = committees[i];
      var name = committee.name;
      var slug = committee.url_name;

      var li = $("<li><a href='#' data-chamber='" + chamber + "' data-committee='" + slug + "'>" + name + "</a></li>");
      chamber_nav.append(li);
    }

    chamber_nav.removeClass('loading');
  });
}

function load_committee(year, chamber, committee) {
  // Display a spinner while loading data
  var container = $('#year-' + year);
  container.empty();
  container.addClass('loading');

  var endpoint = ENDPOINTS.members_by_committee(year, chamber, committee);

  ENDPOINTS.call(endpoint, function(data) {
    var parties = {"Democratic": 0, "Republican": 0, "Other": 0};

    if (data.contents.results && data.contents.results[0].members.length > 0) {
      // Members within this committee were found
      var members = data.contents.results[0].members;

      for (var i=0; i < members.length; i++) {
        var member = members[i];
        var party = member.party;
        switch(party) {
          case "Democratic":
            parties[party]++;
            break;
          case "Republican":
            parties[party]++;
            break;
          default:
            parties["Other"]++;
        }
      }

      draw_chart(
        [
          {party: "Democrats", count: parties["Democratic"]},
          {party: "Republicans", count: parties["Republican"]},
          {party: "Other", count: parties["Other"]}
        ],
        "#year-" + year);
    } else {
      // No members of this committee were found
      container.html("No members were found for the " + year + " session.");
    }

    container.removeClass('loading');
  });
}

(function() {

  // Start by loading the list of committees for each chamber.
  load_committee_list(2012, 'assembly');
  load_committee_list(2012, 'senate');

  // When a committee is clicked on, load its members.
  $('.committees a').live('click', function(ev) {
    $('.committees li').removeClass('active');
    $(ev.target).closest('li').addClass('active');

    var chamber = $(ev.target).data('chamber');
    var committee = $(ev.target).data('committee');
    load_committee(2009, chamber, committee);
    load_committee(2011, chamber, committee);
    return false;
  });

}).call(this);
