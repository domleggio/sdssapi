var express = require('express');
var router = express.Router();


var Match = require('../models/match');


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
router.get('/:teamID', function (req, res) {
    let teamID = req.params.teamID;

    Match.find({
        teams: teamID
    }, function (err, match) {
        if (err) return res.status(500).send("There was a problem finding the teams matches.");
        res.status(200).send(match);
    }).populate('teamID', 'name');
    console.log("end");
});


//Return all matches where team wins

router.get('/wins/:teamID', function (req, res) {
    let teamID = req.params.teamID;

    Match.find({
        winner: teamID
    }, function (err, match) {
        if (err) return res.status(500).send("There was a problem finding the wins");
        res.status(200).send(match);
    }).populate('teamID', 'name');
});


//Returns number of wins per team
router.get('/wins/total/:teamID', function (req, res) {
    let teamID = req.params.teamID;

    Match.count({
        winner: teamID
    }, function (err, wins) {
        if (err) return res.status(500).send("There was a problem finding the wins");
        res.sendStatus(200).send(wins);
        console.log(wins);
    });

    console.log("wins!");
});


//Returns number of losses per a single team **THIS DOESNT WORK YET

var getGames = function (teamID, callback) {
    Match.count({
        teams: teamID
    }), function (err, games) {
        if (err) return console.log("error finding games");
        console.log(games);
        callback(games);
    }
};

var getWins = function (teamID, callback) {
    Match.count({
        winner: teamID
    }, function (err, wins) {
        if (err) return console.log("error finding wins");
        console.log(wins);
        callback(wins);
    })
}



router.get('/games/total/:teamID', function (req, res) {
    let teamID = req.params.teamID;
    console.log("hi");

    getGames(teamID, function (totalGames) {
        getWins(teamID, function (totalWins) {
            let loses = totalGames - totalWins;
            res.send({
                total: totalGames,
                wins: totalWins,
                loses: loses
            })
        })
    })
});











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











//this i dont need

// //Creates a new player and returns the team the player was created for. Includes all players already assigned to the team.
// router.post('/', function (req, res) {
//     Player.create(
//         {
//             player_name: req.body.player_name,
//         },
//         function (err, player) {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).send("There was a problem adding the information to the database.");
//             }
//                 console.log(req.body.teamID);
//                 console.log("hello");
//                 //console.log(teamID);
//                 //res.status(200).send(player);//return the player
//                 let teamID = req.body.teamID;

//                 //find team????

//                 Team.findByIdAndUpdate(teamID, { $push: { players: player._id } }, { new: true }, function (err, team) {
//                     if (err) return res.status(500).send("There was a problem updating the user.");
//                     res.status(200).send(team);
//                 });

//         });

//     //res.status(200).send(player);//return the player
// });