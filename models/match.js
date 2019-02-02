// league.js
var mongoose = require('mongoose'); 

var MatchSchema = new mongoose.Schema({  
  location: {type: String},
  startDate: {type: String},
  teams: [{type: mongoose.Schema.Types.ObjectId, ref: "team"}],
  winner: {type: mongoose.Schema.Types.ObjectId, ref: "team"},
});



mongoose.model('match', MatchSchema);

module.exports = mongoose.model('match');