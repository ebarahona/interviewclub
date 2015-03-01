'use strict'
Parse.$ = jQuery;
Parse.initialize("WYKBPP1wtAdbqiTfjKvkrWhEObFvll67wivhst20", "O1AvRyOcTE1aUV9LvdiJ95Acg9EGyWIgpNf9WNCy");

var currentUser = Parse.User.current();
if (!currentUser) {
  window.alert('the user should exist here, goto some login page now');
}

var userQuery = new Parse.Query(Parse.User);
userQuery.include('expertise');
userQuery.equalTo('username', currentUser.getUsername());

var InterviewRequest = Parse.Object.extend('InterviewRequest');

$(function() {
  userQuery.find({
    success: function(deepUser) {
      if (deepUser.length !== 1) {
        alert("Fuck");
      } else {
        addProfile(deepUser[0]);
      }
    }
  });

  var requestQuery = new Parse.Query(InterviewRequest);
  requestQuery.include('company');
  requestQuery.equalTo('expert', currentUser);
  requestQuery.find({
    success: function(requests) {
      addRequests(requests);
    }
  });
});

function addRequests(requests){
  requests.forEach(function(request) {
    var state = request.get('state') || 'REQUESTED';
    var requestsHtml = tmpl(document.getElementById('request-template').innerHTML, {
      candidateName: request.get('candidateName'),
      candidateEmail: request.get('candidateEmail'),
      candidatePhone: request.get('candidatePhone'),
      state: state,
      companyView: false,
      company: {
        name: request.get('company').get('companyName')
      }
    });
    $('#requests').append(requestsHtml);
  });
}

function addProfile(user) {
    var image = user.get('image');
    var expertise = user.get('expertise');
    var skills = '';
    for (var i in expertise) {
      if (i > 0) skills += ', ';
      skills += expertise[i].get('name');
    }
    if (!skills.length) {
      skills = 'No skills listed. C\'mon, you\'re better than that!';
    }
    var $box = $(tmpl(document.getElementById('box-template').innerHTML, {
      name: user.getUsername(),
      desc: user.get('details'),
      hourly: user.get('price'),
      image: image ? image.url() : '',
      skills: skills,
      expert_id: user.id,
      ui: 'profile'
    }));
    $('#profile').html($box);
    return $box;
  }
