
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

var APP_ID = '[TO_CHANGE]', 
    APP_SECRET = '[TO_CHANGE]';
var CALLBACK_URL = "[TO_CHANGE]/auth/facebook/callback";
var MONGO_URL = 'mongodb://[TO_CHANGE]';


// Mongo Connection
console.log('connexion DB');
  mongoose.connect(MONGO_URL, function(err) {
  if (err) { 
    mongoose.connection.close();
    throw err; 
  }
});

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  console.log('load module ' + models_path+'/'+file);
    require(models_path+'/'+file)
})


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
    profileFields: ['id', 'displayName', 'photos']
  },
  function(req, accessToken, refreshToken, profile, done) {

    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    console.log('profile : ' + JSON.stringify(profile));

    // add access token to session
    req.session.accessToken = accessToken;

    //asynchronous
    process.nextTick(function () {

      // Recherche utilisateur existant en base, si non on le crée
      UserModel.findOne({email : profile.email}
        , function(err, user) {
            if (err) { return done(err); }

            if(user != null) {
              // met a jour l'heure connection
              UserModel.update(
                {_id : user._id}, 
                { lastLogin : Date.now() }, 
                function (e) {
                  res.redirect('/');
                });
            } else {

              user = new UserModel();
              user.name = profile.name;
              user.firstname = profile.firstname; // TODO
              user.email = profile.email;
              user.birthdate = birthdate;
              user.lastLogin = Date.now();

              user.save(function (e) {
                  res.redirect('/');
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
app.use(express.session({ secret: 'your secret here' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('less-middleware')( __dirname + '/public' ));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.configure('development', function(){  
    app.locals.pretty = true;
});
}

var user = require('./routes/user'),
cinema = require('./routes/cinema'),
chart = require('./routes/chart');

app.get('/', routes.index);
app.get('/cinema', ensureAuthenticated, cinema.list);
app.get('/cinema/list/:id', ensureAuthenticated, cinema.list);
app.get('/cinema/listJSON/:id', ensureAuthenticated, cinema.listJSON);
app.get('/cinema/listLastRecommandationsJSON', ensureAuthenticated, cinema.listLastRecommandationsJSON);
app.get('/cinema/viewAdd', ensureAuthenticated, cinema.viewAddMovie);
app.get('/cinema/viewUpdate/:id', ensureAuthenticated, cinema.viewUpdateMovie);
app.post('/cinema/post',  ensureAuthenticated, cinema.postMovie);
app.get('/cinema/delete/:id', ensureAuthenticated, cinema.deleteMovie);
app.post('/cinema/update/:id', ensureAuthenticated, cinema.updateMovie);

app.get('/user', user.list)
app.get('/user/viewAdd', ensureAuthenticated, user.viewAddUser);
app.get('/user/viewUpdate/:id', ensureAuthenticated, user.viewUpdateUser);
app.post('/user/post',  user.postUser);

app.get('/chart/show', chart.show);


// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['user_about_me', 'user_photos', 'email', 'publish_stream', 'publish_actions']}),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  return next();
/*  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')*/
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
