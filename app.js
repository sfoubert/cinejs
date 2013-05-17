
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , routes = require('./routes');

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
  app.use(express.session());
app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


console.log('connexion');
mongoose.connect('mongodb://localhost/cinema', function(err) {
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


var user = require('./routes/user')
  , cinema = require('./routes/cinema');

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/cinema', cinema.list);
app.get('/cinema/add', cinema.addMovie);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
