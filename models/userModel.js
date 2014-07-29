var mongoose = require('mongoose');

// simple but incomplete email regexp:
var emailRegexp = /.+\@.+\..+/;

// Création du schéma
var UserSchema = new mongoose.Schema({
  name : String,
  firstname : String,
  gender : { type : String, 'enum': ['male', 'female']},
  email : {type : String, unique : true, required: true, match : emailRegexp},
  birthday : { type : Date },
  photo : String,
  role : { type : String, 'enum': ['Guest', 'Admin']},
  createdOn : { type : Date, default: Date.now },
  lastLogin : { type : Date }
},
{ collection : 'user' }
);

// Virtual attribute
UserSchema.virtual('displayName').get(function() {
	return [this.firstname, this.name].join(' ');
}).set(function(displayName) {
	var nameComponents = displayName.split(' ');
	this.name = nameComponents.pop();
	this.firstname = nameComponents.join(' ');
});

// Création du Model
mongoose.model('User', UserSchema);
