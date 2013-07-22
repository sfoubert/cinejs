exports.show = function(req, res){
	console.log('Show chart by ' + req.query.view);
	res.render('chart', {view : req.query.view});
};