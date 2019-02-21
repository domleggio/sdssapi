var express = require('express');
var router = express.Router();

var auth = require('../config/auth');
var League = require('../models/league');
var Team = require('../models/team');
var Match = require('../models/match');
//var Player = require('./player');


//Creates a new league **WORKS
router.post('/create', auth, function (req, res) {

    if (req.payload.role === 'league manager' || 'admin') {
        League.create(
            {
                name: req.body.name,
                description: req.body.description,
                sport: req.body.sport,
                startDate: req.body.startDate,
                gender: req.body.gender,
                competitionLevel: req.body.competitionLevel,
                leagueManager: req.body.leagueManager,
                news: req.body.news,
                headline: req.body.headline,
                fee: req.body.fee,
            },
            function (err, league) {
                if (err) {
                    console.log(err);
                    return res.status(500).send("There was a problem adding the information to the database.");
                }
                res.status(200).send(league);
            });
    }
    else {
        return res.status(500).send("Unauthorized to perform this task")
    }


});

//adds a leagueID to a teamID **WORKS
router.post('/addteam', function (req, res) {

    let teamID = req.body.teamID;

    Team.findByIdAndUpdate(
        teamID,
        {
            leagueID: req.body.leagueID
        },
        {
            new: true
        },
        function (err, team) {
            if (err) return res.status(500).send("There was a problem updating the team.");
            res.status(200).send("This was successful");
        }
    );
});

//Returns all the leagues in the database
router.get('/', function (req, res) {
    League.find({}, function (err, leagues) {
        if (err) return res.status(500).send("There was a problem finding the leagues.");
        res.status(200).send(leagues);
    });
});


//Returns all the unique sports in the database
router.get('/sport', function (req, res) {
    League.distinct("sport", {}, function (err, league) {
        if (err) return res.status(500).send("There was a problem finding the leagues.");
        res.status(200).send(league);
    });
});


//Deletes a single league from the database
router.delete('/:id', function (req, res) {
    League.findByIdAndRemove(req.params.id, function (err, league) {
        if (err) return res.status(500).send("There was a problem deleting the league.");
        res.status(200).send("League " + league.description + " was deleted.");
    });
});

//Updates a single team in the database
router.put('/:id', function (req, res) {
    League.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, team) {
        if (err) return res.status(500).send("There was a problem updating the team.");
        res.status(200).send(team);
    });
});





//Gets all leagues based on the sport ** WORKS
router.get('/:sport', function (req, res) {
    let sport = req.params.sport;
    League.find({
        sport: sport
    }, function (err, league) {
        if (err) return res.status(500).send("There was a problem finding the leagues.");

        res.status(200).send(league);
    });
});

//Gets a single league from the database
router.get('/league/:id', function (req, res) {
    console.log(req.params.id);
    let leagueID = req.params.id;
    League.findById(leagueID, function (err, league) {
        if (err) return res.status(500).send("There was a problem finding the league.");
        if (!league) return res.status(404).send("No league found.");
        res.status(200).send(league);
    });
});

//Gets all teams with a specific leagueID**WORKS

router.get('/team/:id', function (req, res) {
    let leagueID = req.params.id;

    //find teams
    Team.find(
        {
            leagueID: leagueID
        },
        function (err, team) {
            console.log(team);
            if (err || !team) {

                res.send("Error!");

            }
            res.status(200).send(team);
        })
});


//GETS ALL TEAMS WITH A SPECIFIC LEAGUEID AND RETURNS THE WINS/LOSSES
//GETS ALL TEAMS WITH A SPECIFIC LEAGUEID AND RETURNS THE WINS/LOSSES
//GETS ALL TEAMS WITH A SPECIFIC LEAGUEID AND RETURNS THE WINS/LOSSES
//GETS ALL TEAMS WITH A SPECIFIC LEAGUEID AND RETURNS THE WINS/LOSSES
//GETS ALL TEAMS WITH A SPECIFIC LEAGUEID AND RETURNS THE WINS/LOSSES
//GETS ALL TEAMS WITH A SPECIFIC LEAGUEID AND RETURNS THE WINS/LOSSES
//GETS ALL TEAMS WITH A SPECIFIC LEAGUEID AND RETURNS THE WINS/LOSSES
//GETS ALL TEAMS WITH A SPECIFIC LEAGUEID AND RETURNS THE WINS/LOSSES

// var getGames = function (teamID, callback) {
//     console.log("getGames");
//     Match.count({
//         teams: teamID
//     }, function (err, totalGames) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             callback(totalGames);
//         }
//     })
// };

// var getWins = function (teamID, callback) {
//     console.log("getWins");
//     Match.count({
//         winner: teamID
//     }, function (err, wins) {
//         if (err) return console.log("error finding wins");
//         callback(wins);
//     })
// }

router.get('/games/total/:teamID', function (req, res) {
    let teamID = req.params.teamID;

    getGames(teamID, function (totalGames) {
        getWins(teamID, function (totalWins) {
            let loses = totalGames - totalWins;
            res.json({
                total: totalGames,
                wins: totalWins,
                loses: loses
            })
        })
    })
});


//USE THE LEAGUE ID TO GET ALL THE TEAMS AND ALL THE WINS LOSSES OF THOSE TEAMS
//USE THE LEAGUE ID TO GET ALL THE TEAMS AND ALL THE WINS LOSSES OF THOSE TEAMS
//USE THE LEAGUE ID TO GET ALL THE TEAMS AND ALL THE WINS LOSSES OF THOSE TEAMS
//USE THE LEAGUE ID TO GET ALL THE TEAMS AND ALL THE WINS LOSSES OF THOSE TEAMS
//USE THE LEAGUE ID TO GET ALL THE TEAMS AND ALL THE WINS LOSSES OF THOSE TEAMS
//USE THE LEAGUE ID TO GET ALL THE TEAMS AND ALL THE WINS LOSSES OF THOSE TEAMS


//LUKE AWAIT FUNCTION




// router.get('/nowaythisworks/:id', async (req, res) =>{
//     let leagueID = req.params.id

//     //find teams
//     let teams = await Team.find(
//     {
//       leagueID: leagueID
//     }).then(async (allTeams) => {

//       //the result of our database read


//       return allTeams.toJSON(); // look up if this is right
//     }).catch(async (err) => {
//       //any errors that might have happened
//       res.json({error:err});
//       throw({error:err});
//     });

//     teams = await Promise.all(teams.map(async(team)=>{

//       team.wins = await getWins(team._id);
//       team.totalGames = await getGames(team._id);

//       team.loses = team.totalGames - team.wins;

//       return team;
//     }));

//     res.json(teams);

//   });


var getGames = function (team, callback) {
    console.log("getGames");
    Match.count({
        teams: team._id
    }, function (err, totalGames) {
        if (err) {
            console.log(err);
        }
        else {
            team.totalGames = totalGames;
            console.log("totalgames = " + team.totalGames);
            return callback(team);
        }
    })
};

var getWins = function (team, callback) {
    console.log("getWins");
    Match.count({
        winner: team._id
    }, function (err, wins) {
        if (err) return console.log("error finding wins");
        team.wins = wins;
        team.losses = team.totalGames - team.wins;
        console.log("team wins = " + team.wins);
        
        return callback(team);
    })
}

var getTotals = function (team, callback) {
    getGames(team, function (teamWithGames) {
        getWins(teamWithGames, function (teamWithWinsAndGames) {
            return callback(teamWithWinsAndGames);
        })
    })
}




router.get('/nowaythisworks/:id', function (req, res) {
    let leagueID = req.params.id
    let returnObj = [];

    Team.find({
        leagueID: leagueID
    }, function (err, teams) {
        let counter = 0;

        //make the team a JSON here???


        for (let i = 0; i < teams.length; i++) {

            getTotals(teams[i].toJSON(), function (team) {
                returnObj.push(team);
                counter++
                if (counter >= teams.length) {
                    res.json(returnObj);
                }
            })
        }
    })
});





module.exports = router;