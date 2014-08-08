var mongoose = require('mongoose'),
    moment = require('moment'),
    fb = require('./facebook'),
    EntryModel = mongoose.model('Entry'),
    MovieModel = mongoose.model('Movie');

var limit = 20;

exports.list = function(req, res) {
    var idStart = req.param('id');
    var userId = req.param('userId');

    if (idStart == null || idStart < 0) {
        idStart = 0;
    }

    if (userId == null) {
        userId = req.user._id;
    }

    //console.log('user id : ' + req.user._id);
    EntryModel.find({
        user: userId
    }).sort({
        viewdate: -1
    }).limit(limit).skip(idStart).populate('movie').exec(function(err, result) {
        if (err) {
            throw err;
        }

        EntryModel.count({}, function(err, count) {
            console.log("Number of movies:", count);

            res.render('entry', {
                title: 'Liste des films',
                movies: result,
                count: count,
                moment: moment,
                idStart: parseInt(idStart),
                user: req.user
            });

        })

    });

};

exports.listJSON = function(req, res) {
    var idStart = req.param('id');
    var userId = req.param('userId');

    if (idStart == null || idStart < 0) {
        idStart = 0;
    }

    if (userId == null) {
        userId = req.user._id;
    }

    EntryModel.find({
        user: userId
    }).sort({
        viewdate: -1
    }).limit(limit).skip(idStart).populate('movie').exec(function(err, result) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
};


exports.listLastRecommandationsJSON = function(req, res) {
    EntryModel.find({
        recommandation: true
    }).sort({
        viewdate: -1
    }).limit(30).populate('movie user').exec(function(err, result) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
};

exports.listUserLastRecommandationsJSON = function(req, res) {
    EntryModel.find({
        user: req.user._id,
        recommandation: true
    }).sort({
        viewdate: -1
    }).limit(30).populate('movie user').exec(function(err, result) {
        if (err) {
            throw err;
        }
        res.send(result);
    });
};

exports.viewAddMovie = function(req, res) {
    console.log('View Add movie');

    var entry = new EntryModel();
    entry.viewdate = moment();

    res.render('addOrUpdateMovie', {
        title: 'Ajouter un film',
        action: 'post',
        submit: 'Ajouter',
        entry: entry,
        moment: moment,
        user: req.user
    });
};

exports.viewUpdateMovie = function(req, res) {

    console.log('View Update movie : ' + req.params.id);

    EntryModel.findById(req.params.id, function(err, entry) {
        if (err) {
            throw err;
        }

        res.render('addOrUpdateMovie', {
            title: 'Modifier un film',
            action: 'update/' + req.params.id,
            submit: 'Modifier',
            entry: entry,
            movieTitle: (entry.movie != null) ? entry.movie.title : '',
            moment: moment,
            user: req.user
        });

    }).populate('movie');
};

exports.postMovie = function(req, res) {
    console.log('Post movie : ' + req.body);
    var viewdate = req.body.viewdate.substring(6, 10) + '-' + req.body.viewdate.substring(3, 5) + '-' + req.body.viewdate.substring(0, 2);

    var movie = new MovieModel();
    movie.title = req.body.title;
    movie.save();

    var entry = new EntryModel();
    if (movie != null) {
        entry.movie = movie._id;
    }
    entry.viewdate = viewdate;
    entry.comment = req.body.comment;
    entry.score = req.body.score;
    entry.recommandation = req.body.recommandation;
    if (req.user != null) {
        entry.user = req.user._id;
    }

    // post message to fb
    if (req.user != null && req.body.recommandation == 'on') {
        var message = req.user.firstname + ' ' + req.user.name + " recommande " + req.body.title + " à " + req.body.score + '%' + "\n";
        message += "from ";
        message += process.env.CONTEXT_PATH;
        fb.postMessage(req.session.accessToken, message);
    }

    entry.save(function(e) {
        res.redirect('/entry');
    });

}

exports.deleteMovie = function(req, res) {
    console.log('Delete movie : ' + req.params.id);

    EntryModel.remove({
        _id: req.params.id
    }, function(e) {
        res.redirect('/entry');
    });
}

exports.updateMovie = function(req, res) {
    console.log('Update movie : ' + req.params.id);
    var viewdate = req.body.viewdate.substring(6, 10) + '-' + req.body.viewdate.substring(3, 5) + '-' + req.body.viewdate.substring(0, 2);

    EntryModel.findById(req.params.id, function(err, entry) {
        if (err) {
            console.log(err);
            res.redirect('/entry');
        } else {
            // Update movie
            MovieModel.update({
                    _id: entry.movie._id
                }, {
                    title: req.body.title
                },
                function(err) {
                    if (err) {
                        console.log(err);
                        res.redirect('/entry');
                    } else {
                        // Update entry
                        EntryModel.update({
                                _id: req.params.id
                            }, {
                                viewdate: viewdate,
                                comment: req.body.comment,
                                score: req.body.score,
                                recommandation: req.body.recommandation
                            },
                            function(err) {
                                if (err) console.log(err);
                                res.redirect('/entry');
                            });
                    }

                });

        }
    }).populate('movie');

}
