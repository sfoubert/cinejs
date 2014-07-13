var mongoose = require('mongoose');


// Création du schéma
var UserSchema = new mongoose.Schema({
//  _id : String,
  name : String,
  firstname : String,
  email : String,
  birthdate : { type : Date }
},
{ collection : 'user' }
);

// Création du Model
mongoose.model('User', UserSchema);