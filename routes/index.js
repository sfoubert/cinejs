/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { 
		title: 'Cinema JS',
		user : req.user
	});
};