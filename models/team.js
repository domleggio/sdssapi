// team.js
var mongoose = require('mongoose');  

var TeamSchema = new mongoose.Schema({
    name:{type: String,required: true},
    leagueID:{type: mongoose.Schema.Types.ObjectId, ref:'league', required:true},
    players: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    captain: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},

  })


mongoose.model('team', TeamSchema)

module.exports = mongoose.model('team');