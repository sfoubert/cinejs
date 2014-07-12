
var mongoose = require('mongoose'),
	moment = require('moment'),
    MovieModel = mongoose.model('Movie');

exports.show = function(req, res){
	console.log('Show chart by ' + req.query.view);
	var year = req.query.year;
	//annee courante par défaut
	if(year == null) year = moment().format("YYYY");

	callback = function (error, result) {
        if (error){
        	return res.send(500, { error: error }); 
        }
        if(result){
	        console.log('result : ' + JSON.stringify(result));

			var labels = [];
			var data = [];
			for (var i in result) {
			  if (result[i].hasOwnProperty("count")) {
			  	if(req.query.view == 'month') {
			    	labels.push(result[i]._id.month +'/' + result[i]._id.year);
			    } else if(req.query.view == 'year') {
					labels.push(result[i]._id.year);
			    }
			    data.push(result[i].count);
			  }
			}

	        res.render('chart', {
	        	view : req.query.view,
	        	year : year,
	        	labels : JSON.stringify(labels),
	        	data : JSON.stringify(data),
	        	moment: moment,
		      	currentYear: parseInt(moment().format("YYYY"))
	        });
        }
      }
      

	if(req.query.view == 'month'){
	/* result : 
	[ { "_id" : { "month" : 4,
	        "year" : 2014
	      },
	    "count" : 4
	  },
	  { "_id" : { "month" : 3,
	        "year" : 2014
	      },
	    "count" : 6
	  },
	  ...]
	  */
		MovieModel.aggregate(
			  { $match: { viewdate: { $exists: true,  $gte: new Date(year + '-01-01'), $lt: new Date((parseInt(year) + 1) + '-01-01') } } },
		      { $group : { 
		           _id : { year: { $year : "$viewdate" }, month: { $month : "$viewdate" }}, 
		           count : { $sum : 1 }}
		      },
	          { $sort: { _id: 1 } },
		      callback
		);

	}else if(req.query.view == 'year') {
		MovieModel.aggregate(
			  { $match: { viewdate: { $exists: true } } },
		      { $group : { 
		           _id : { year: { $year : "$viewdate" } }, 
		           count : { $sum : 1 }}
		      },
	          { $sort: { _id: 1 } },
		      callback
		);
	}

	
};