
var mongoose = require('mongoose'),
    MovieModel = mongoose.model('Movie');

exports.show = function(req, res){
	console.log('Show chart by ' + req.query.view);



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
	        	labels : JSON.stringify(labels),
	        	data : JSON.stringify(data)
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
			  { $match: { viewdate: { $exists: true,  $gte: new Date('2013-01-01'), $lt: new Date('2014-01-01') } } },
		      { $group : { 
		           _id : { year: { $year : "$viewdate" }, month: { $month : "$viewdate" }}, 
		           count : { $sum : 1 }}
		      },
	          { $sort: { _id: -1 } },
		      callback
		);

	}else if(req.query.view == 'year') {
		MovieModel.aggregate(
			  { $match: { viewdate: { $exists: true } } },
		      { $group : { 
		           _id : { year: { $year : "$viewdate" } }, 
		           count : { $sum : 1 }}
		      },
	          { $sort: { _id: -1 } },
		      callback
		);
	}

	
};