var mongoose = require('mongoose');


// Création du schéma
var UserSchema = new mongoose.Schema({
  name : String,
  firstname : String,
  email : String,
  password : String,
  birthdate : { type : Date }
},
{ collection : 'user' }
);

// Création du Model
mongoose.model('User', UserSchema);