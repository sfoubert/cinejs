var mongoose = require('mongoose');


// Création du schéma
var MovieSchema = new mongoose.Schema({
  title : String,
  viewdate : { type : Date},
  comment : String,
  score : {type: Number, min: 0, max:100, default : 0},
  recommandation : { type : Boolean, default : false} ,
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},
{ collection : 'movie' }
);

// Création du Model
mongoose.model('Movie', MovieSchema);