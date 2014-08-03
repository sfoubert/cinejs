var mongoose = require('mongoose'),
    moment = require('moment'),
    ProposalModel = mongoose.model('Proposal');

exports.viewAddProposal = function(req, res){
	console.log('View Add proposal');

	var proposalModel = new ProposalModel();
	proposalModel.createdOn = moment();

	res.render('addProposal', {
		title: 'Faire une proposition',
		proposal : proposalModel,
		moment: moment,
		user : req.user
	});
};

exports.list = function(req, res){

	ProposalModel.find({user: req.user._id}).sort({createdOn: -1}).populate('movie user receivers').exec(function(err, result) { 
	  if (err) { throw err; }

      res.render('proposal', { 
      	title: 'Mes propositions',
      	proposals: result,
      	user : req.user
       });

	});

};

exports.postProposal = function(req, res){ 
    console.log('Post proposal : ' + req.body);

	var proposal = new ProposalModel();
	//TODO

	user.save(function (err) {
	    res.redirect('/proposal');
	  });
    
}

