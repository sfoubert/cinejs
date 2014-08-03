var mongoose = require('mongoose');


// Création du schéma
var ProposalSchema = new mongoose.Schema({
  movie : {type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required : true},
  user : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
  receivers : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
  status : { type : String, 'enum': ['accepted', 'refused', 'ignored', 'wait'], default : 'wait'},
  createdOn : { type : Date, default: Date.now },
  responsedOn : { type : Date }
},
{ collection : 'proposal' }
);

// Création du Model
mongoose.model('Proposal', ProposalSchema);