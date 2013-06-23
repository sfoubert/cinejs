var mongoose = require('mongoose'),
    moment = require('moment'),
    Cinema = mongoose.model('Cinema');

var limit = 20;


exports.list = function(req, res){

	var idStart = req.param('id');

	if (idStart == null) {
		idStart = 0;

	}


	Cinema.find({}).sort({viewdate: -1}).limit(limit).skip(idStart).exec(function(err, result) { 
	  if (err) { throw err; }

/*
	  // On va parcourir le resultat et les afficher joliment
	  var comm;
	  for (var i = 0, l = result.length; i < l; i++) {
	    comm = result[i];
	    console.log('------------------------------');
	    console.log('Titre : ' + comm.movie);
	    console.log('Date : ' + comm.viewdate);
	    console.log('Commentaire : ' + comm.comment);
	    console.log('------------------------------');
	  }
*/
      res.render('cinema', { 
      	title: 'Liste des films',
      	movies: result,
      	count: result.length,
      	moment: moment
       });

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
    console.log('seb');
  	console.log(req.title);
    res.render('index', { title: 'Cinema JS'});
}