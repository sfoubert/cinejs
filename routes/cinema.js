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

exports.addMovie = function(req, res){
	console.log('Add movie');
	res.render('addMovie', {
		title: 'Ajouter un film'
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