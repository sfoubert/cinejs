var mongoose = require('mongoose');


// Création du schéma
var EntrySchema = new mongoose.Schema({
  movie : {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'},
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  viewdate : { type : Date},
  comment : String,
  score : {type: Number, min: 0, max:100, default : 0},
  recommandation : { type : Boolean, default : false}
},
{ collection : 'entry' }
);

// Création du Model
mongoose.model('Entry', EntrySchema);