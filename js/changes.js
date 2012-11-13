function load_committee(year, chamber, committee) {
  // Display a spinner while loading data
  $("#year-" + year).empty();
  $("#year-" + year).addClass('loading');

  var endpoint = ENDPOINTS.members_by_committee(year, chamber, committee);

  ENDPOINTS.call(endpoint, function(data) {
    var parties = {"Democratic": 0, "Republican": 0, "Other": 0};

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
  });
}

(function() {

  // When a committee is clicked on, load its members.
  $('.committees a').live('click', function(ev) {
    $('.committees li').removeClass('active');
    $(ev.target).closest('li').addClass('active');

    var chamber = $(ev.target).data('chamber');
    var committee = $(ev.target).data('committee');
    load_committee(2009, chamber, committee);
    load_committee(2011, chamber, committee);
  });

  // Automatically select the first committee
  $($('.committees a')[0]).click();

}).call(this);
