var mongoose = require('mongoose'),
    moment = require('moment'),
    UserModel = mongoose.model('User');

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.postUser = function(req, res){ 
    console.log('Post user : ' + req.body);
  	var birthdate = req.body.birthdate.substring(6,10) + '-' + req.body.birthdate.substring(3,5) + '-' + req.body.birthdate.substring(0,2);

	var user = new UserModel();
	user.name = req.body.name;
	user.firstname = req.body.firstname;
	user.email = req.body.email;
	user.birthdate = birthdate;

	user.save(function (e) {
	    res.redirect('/user');
	  });
    
}


exports.viewAddUser = function(req, res){
	console.log('View Add user');

	var user = new UserModel();
	user.birthdate = moment();

	res.render('addOrUpdateUser', {
		title: 'Ajouter un utilisateur',
		action : 'post',
		submit : 'Ajouter',
		user : user,
		moment: moment
	});
};

exports.viewUpdateUser = function(req, res){

	console.log('View Update user : ' + req.params.id);

	UserModel.findById(req.params.id, function(err, result) { 
	  if (err) { throw err; }

		res.render('addOrUpdateUser', {
			title: 'Modifier un utilisateur',
			action : 'update/' + req.params.id,
			submit : 'Modifier',
			user : result,
			moment: moment
		});

	});
};
