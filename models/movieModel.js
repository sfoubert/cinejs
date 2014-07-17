var mongoose = require('mongoose');


// Création du schéma
var MovieSchema = new mongoose.Schema({
  title : String,
  viewdate : { type : Date/*, default : Date.now */},
  comment : String,
  user_id : String
},
{ collection : 'movie' }
);

// Création du Model
mongoose.model('Movie', MovieSchema);