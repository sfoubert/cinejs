var mongoose = require('mongoose');


// Création du schéma
var MovieSchema = new mongoose.Schema({
  title : String,
  categories : [String]
},
{ collection : 'movie' }
);

// Création du Model
mongoose.model('Movie', MovieSchema);