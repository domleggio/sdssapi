var express = require('express');
var router = express.Router();


var Match = require('../models/match');
var Team = require('../models/team');


//Creates a new match
router.post('/create', function (req, res) {
    Match.create(
        {
            location: req.body.location,
            startDate: req.body.startDate,
            teams: [],
        },
        function (err, match) {
            if (err) {
                return res.status(500).send("There was a problem adding the information to the database.");
            }
            res.status(200).send(match);
        });
});

//Add teams to a match
router.post('/updateTeams', function (req, res) {

    let matchID = req.body.matchID;

    Match.findByIdAndUpdate(
        matchID,
        {
            $push: {
                teams: req.body.teams
            }
        },
        function (err, match) {
            if (err) return res.status(500).send("There was a problem updating the match.");
            res.status(200).send(match);
        }
    );
});

//Add winner to a match

router.post('/winner', function (req, res) {
    let teamID = req.body.teamID;
    let matchID = req.body.matchID;

    Match.findByIdAndUpdate(
        matchID,
        {
            winner: teamID
        },
        function (err, match) {
            if (err) return res.status(500).send("There was a problem updating the winner");
            res.status(200).send(match);
        }
    );
});

//Return all matches that a team plays in
router.get('/:teamID/upcomingGames', function (req, res) {
    let teamID = req.params.teamID;
    console.log("being called");

    Match.find({
        teams: teamID
    }, function (err, match) {
        if (err) return res.status(500).send("There was a problem finding the teams matches.");
        res.status(200).send(match);
    }).populate('teamID', 'name');

});


//Return all upcoming matches per league


router.get('/upcomingGames/:leagueID', function(req, res){
    let leagueID = req.params.leagueID;
    console.log("searching for matches by league");

    Team.find({
        leagueID: leagueID
    }, function(err, team) {
        if(err || !team){
            res.send("Error!");
            return;
        }
        console.log("teams = " + team);

        var i;
        var matchesArray= [];
        var counter = 0;

        for(i = 0; i<team.length; i++){
            Match.find({
                teams: team[i]._id
            }, function(err, matches){
                if(err){
                    res.send("ERROR");
                }
                else{
                    matchesArray.push(matches);
                    console.log("matches at i= " + matchesArray[i]);
                    counter++;
                    if(counter >= team.length){
                        console.log("if statement");
                        res.json({
                            matches: matchesArray
                        })
                    }
                    
                }
            })          

        }
    })
})







//Returns all the matches in the database
router.get('/', function (req, res) {
    Match.find({}, function (err, matches) {
        if (err) return res.status(500).send("There was a problem finding the matches.");
        res.status(200).send(matches);
    });
});

//Gets a single match from the database
router.get('/:id', function (req, res) {
    Match.findById(req.params.id, function (err, match) {
        if (err) return res.status(500).send("There was a problem finding the match.");
        if (!match) return res.status(404).send("No match found.");
        res.status(200).send(match);
    });
});

//Deletes a single match from the database
router.delete('/:id', function (req, res) {
    Match.findByIdAndRemove(req.params.id, function (err, match) {
        if (err) return res.status(500).send("There was a problem deleting the match.");
        res.status(200).send("Match " + match.id + " was deleted.");
    });
});

//Updates a single match in the database
router.put('/:id', function (req, res) {
    Match.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, match) {
        if (err) return res.status(500).send("There was a problem updating the match.");
        res.status(200).send(match);
    });
});



module.exports = router;