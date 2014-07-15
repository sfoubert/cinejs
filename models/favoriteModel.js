var mongoose = require('mongoose');


// Création du schéma
var FavoriteSchema = new mongoose.Schema({
  user_id : String,
  movie_id : String
},
{ collection : 'favorite' }
);

// Création du Model
mongoose.model('Favorite', FavoriteSchema);