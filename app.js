/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    routes = require('./routes');

var APP_ID = process.env.APP_ID,
    APP_SECRET = process.env.APP_SECRET,
    CALLBACK_URL = process.env.CONTEXT_PATH + "/auth/facebook/callback",
    MONGO_URI = process.env.MONGO_URI; //'mongodb://localhost:27017/test';

console.log('APP_ID : ' + APP_ID);
console.log('APP_SECRET : ' + APP_SECRET);
console.log('CALLBACK_URL : ' + CALLBACK_URL);
console.log('MONGO_URI : ' + MONGO_URI);

// Mongo Connection
console.log('connexion DB');
mongoose.connect(MONGO_URI, function(err) {
    if (err) {
        mongoose.connection.close();
        throw err;
    }
});

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function(file) {
    console.log('load module ' + models_path + '/' + file);
    require(models_path + '/' + file);
})

var UserModel = mongoose.model('User');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
        clientID: APP_ID,
        clientSecret: APP_SECRET,
        callbackURL: CALLBACK_URL,
        passReqToCallback: true,
        profileFields: ['id', 'first_name', 'last_name', 'gender', 'birthday', 'photos', 'email']
    },
    function(req, accessToken, refreshToken, profile, done) {

        console.log('accessToken : ' + accessToken);
        console.log('profile : ' + JSON.stringify(profile));

        // add access token to session
        req.session.accessToken = accessToken;

        //asynchronous
        process.nextTick(function() {

            var email = profile.emails[0].value;
            // Recherche utilisateur existant en base, si non on le crée
            UserModel.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user != null) {
                    // met a jour l'heure connexion
                    UserModel.update({
                            _id: user._id
                        }, {
                            lastLogin: Date.now(),
                            name: profile.name.familyName,
                            firstname: profile.name.givenName,
                            gender: profile.gender,
                            photo: profile.photos[0].value,
                            //birthday : profile.birthday
                        },
                        function(err) {
                            if (err) {
                                return done(err);
                            }
                            console.log("User updated");
                        });
                } else {

                    user = new UserModel();
                    user.name = profile.name.familyName;
                    user.firstname = profile.name.givenName;
                    user.gender = profile.gender;
                    user.email = email;
                    user.photo = profile.photos[0].value;
                    //user.birthday = profile.birthday;
                    user.lastLogin = Date.now();

                    console.log("Save user " + user);
                    user.save(function(err) {
                        if (err) {
                            return done(err);
                        }
                        console.log("User created : " + user.email);
                    });

                }
                done(null, user);
            });

        });
    }
));


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
    secret: 'your secret here'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.configure('development', function() {
        app.locals.pretty = true;
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });
}

app.configure('production', function() {
    app.use(express.errorHandler());
});

var user = require('./routes/user'),
    entry = require('./routes/entry'),
    proposal = require('./routes/proposal'),
    chart = require('./routes/chart');

app.get('/', routes.index);
app.get('/entry', ensureAuthenticated, entry.list);
app.get('/entry/list/:id', ensureAuthenticated, entry.list);
app.get('/entry/listJSON/:id', ensureAuthenticated, entry.listJSON);
app.get('/entry/user/:userId/listJSON/:id', ensureAuthenticated, entry.listJSON);
app.get('/entry/listLastRecommandationsJSON', entry.listLastRecommandationsJSON);
app.get('/entry/user/:userId/listLastRecommandationsJSON', entry.listUserLastRecommandationsJSON);
app.get('/entry/user/:userId/listLastEntriesJSON', entry.listUserLastEntriesJSON);
app.get('/entry/viewAdd', ensureAuthenticated, entry.viewAddMovie);
app.get('/entry/viewUpdate/:id', ensureAuthenticated, entry.viewUpdateMovie);
app.post('/entry/post', ensureAuthenticated, entry.postMovie);
app.get('/entry/delete/:id', ensureAuthenticated, entry.deleteMovie);
app.post('/entry/update/:id', ensureAuthenticated, entry.updateMovie);

app.get('/user/listJSON', ensureAuthenticated, user.listJSON)
app.get('/user/viewAdd', ensureAuthenticated, user.viewAddUser);
app.get('/user/viewUpdate/:id', ensureAuthenticated, user.viewUpdateUser);
app.get('/user/view/:id', ensureAuthenticated, user.viewDetails);
app.post('/user/post', ensureAuthenticated, user.postUser);

app.get('/proposal', ensureAuthenticated, proposal.list);
app.get('/proposal/viewAdd', ensureAuthenticated, proposal.viewAddProposal);
app.post('/proposal/post', ensureAuthenticated, proposal.postProposal);

app.get('/chart/show', ensureAuthenticated, chart.show);


// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
    passport.authenticate('facebook', {
        scope: ['user_about_me', 'user_photos', 'email', 'publish_actions']
    }),
    function(req, res) {
        // The request will be redirected to Facebook for authentication, so this
        // function will not be called.
    });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called.
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

function ensureAuthenticated(req, res, next) {
    /*    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');*/
    return next();
}

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});