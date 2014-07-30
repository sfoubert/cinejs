/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log('user JSON : ' + JSON.stringify(req.user));
	res.render('index', { 
		title: 'Cinema JS',
		user : req.user
	});
};