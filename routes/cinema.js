var mongoose = require('mongoose'),
    moment = require('moment'),
    MovieModel = mongoose.model('Movie');

var limit = 20;


exports.list = function(req, res){
	var idStart = req.param('id');

	if (idStart == null) {
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
		      	moment: moment
		       });

		})

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
		moment: moment
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
			moment: moment
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

	MovieModel.update({_id : req.params.id}, {title : req.body.title, viewdate : viewdate, comment : req.body.comment}, function (e) {
	    res.redirect('/cinema');
	  });
}