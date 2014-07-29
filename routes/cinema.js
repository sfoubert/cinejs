var mongoose = require('mongoose'),
    moment = require('moment'),
    fb = require('./facebook'),
    MovieModel = mongoose.model('Movie');

var limit = 20;

exports.list = function(req, res){
	var idStart = req.param('id');

	if (idStart == null || idStart < 0) {
		idStart = 0;
	}

	MovieModel.find({}).sort({viewdate: -1}).limit(limit).skip(idStart).exec(function(err, result) { 
	  if (err) { throw err; }

		MovieModel.count({}, function(err, count){
		    console.log( "Number of movies:", count);

		      res.render('cinema', { 
		      	title: 'Liste des films',
		      	movies: result,
		      	count: count,
		      	moment: moment,
		      	idStart: parseInt(idStart),
		      	user : req.user
		       });

		})

	});

};

exports.listJSON = function(req, res){
	var idStart = req.param('id');

	if (idStart == null || idStart < 0) {
		idStart = 0;
	}

	MovieModel.find({}).sort({viewdate: -1}).limit(limit).skip(idStart).exec(function(err, result) { 
		if (err) { throw err; }
		res.send(result);
	});
};


exports.listLastRecommandationsJSON = function(req, res){
	MovieModel.find({recommandation : true}).sort({viewdate: -1}).limit(30).populate('user').exec(function(err, result) { 
		if (err) { throw err; }
		res.send(result);
	});
};

exports.viewAddMovie = function(req, res){
	console.log('View Add movie');

	var movie = new MovieModel();
	movie.viewdate = moment();

	res.render('addOrUpdateMovie', {
		title: 'Ajouter un film',
		action : 'post',
		submit : 'Ajouter',
		movie : movie,
		moment: moment,
		user : req.user
	});
};

exports.viewUpdateMovie = function(req, res){

	console.log('View Update movie : ' + req.params.id);

	MovieModel.findById(req.params.id, function(err, result) { 
	  if (err) { throw err; }

		res.render('addOrUpdateMovie', {
			title: 'Modifier un film',
			action : 'update/' + req.params.id,
			submit : 'Modifier',
			movie : result,
			moment: moment,
			user : req.user
		});

	});
};

exports.postMovie = function(req, res){ 
    console.log('Post movie : ' + req.body);
  	var viewdate = req.body.viewdate.substring(6,10) + '-' + req.body.viewdate.substring(3,5) + '-' + req.body.viewdate.substring(0,2);

	var movie = new MovieModel();
	movie.title = req.body.title;
	movie.viewdate = viewdate;
	movie.comment = req.body.comment;
	movie.score = req.body.score;
	movie.recommandation = req.body.recommandation;
	if (req.user!=null) {
		movie.user = req.user._id;
	}

	// post message to fb
	if (req.user!=null && req.body.recommandation == 'on') {
		var message = req.user.firstname + ' ' +  req.user.name + " recommande " + req.body.title + "\n";
		message += "from http://cinejs.herokuapp.com";
		fb.postMessage(req.session.accessToken, message);
	}

	movie.save(function (e) {
	    res.redirect('/cinema');
	  });
    
}

exports.deleteMovie = function(req, res){ 
    console.log('Delete movie : ' + req.params.id);

	MovieModel.remove({_id : req.params.id}, function (e) {
	    res.redirect('/cinema');
	  });
}

exports.updateMovie = function(req, res){ 
    console.log('Update movie : ' + req.params.id);
	var viewdate = req.body.viewdate.substring(6,10) + '-' + req.body.viewdate.substring(3,5) + '-' + req.body.viewdate.substring(0,2);

	MovieModel.update(
		{_id : req.params.id}, 
		{title : req.body.title, 
			viewdate : viewdate, 
			comment : req.body.comment,
			score : req.body.score,
			recommandation : req.body.recommandation
		}, 
		function (e) {
	    res.redirect('/cinema');
	  });
}