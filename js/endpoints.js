ENDPOINTS = {
  committees_by_chamber: function(year, chamber) {
    return "http://api.nytimes.com/svc/politics/v2/ny/legislative/" + year + "/" + chamber + "/committees.json?api-key=" + API_KEY;
  },
  members_by_committee: function(year, chamber, committee) {
    return "http://api.nytimes.com/svc/politics/v2/ny/legislative/" + year + "/" + chamber + "/committees/" + committee + ".json?api-key=" + API_KEY;
  },
  call: function(endpoint, callback) {
    $.getJSON('http://anyorigin.com/get?url=' + endpoint + '&callback=?', function(data){
      callback(data);
    });
  }
};
