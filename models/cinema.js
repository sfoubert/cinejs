var mongoose = require('mongoose');


// Création du schéma
var CinemaSchema = new mongoose.Schema({
  movie : String,
  viewdate : { type : Date, default : Date.now },
  comment : String
},
{ collection : 'cinema' }
);

// Création du Model
mongoose.model('Cinema', CinemaSchema);