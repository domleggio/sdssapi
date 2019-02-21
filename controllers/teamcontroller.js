var express = require('express');
var router = express.Router();
var auth = require('../config/auth');


var Team = require('../models/team');
var User = require('../models/user');
var Match = require('../models/match');


//Creates a new team **WORKS
router.post('/create', function (req, res) {
    console.log(res);
    Team.create(
        {
            name: req.body.name,
            leagueID: req.body.leagueID,
            captain: req.body.captain,

        },
        function (err, team) {
            if (err) {
                console.log(err);
                return res.status(500).send("There was a problem adding the information to the database.");
            }
            res.status(200).send(team);
        });
});

//adds a user to a team **WORKS
router.post('/player/add', function (req, res) {

    let teamID = req.body.teamID;

    Team.findByIdAndUpdate(
        teamID,
        {
            $push: {
                players: req.body.userID
            }
        },
        {
            new: true
        },
        function (err, team) {
            if (err) return res.status(500).send("There was a problem updating the team.");
            res.status(200).send(team);
        }
    );
});

//Returns all the teams in the database
router.get('/', function (req, res) {
    Team.find({} , function (err, teams) {
        if (err) return res.status(500).send("There was a problem finding the teams.");
        res.status(200).send(teams);
    });
});


//Gets a single team name and ID from the database DOM FUNCTION

router.get('/:id', function (req, res) {
    let teamID = req.params.id;
    let returnData = {};


    //find team
    Team.findById(
        
        {
            _id: teamID
            
            
        }, function (err, team) {
            if (err || !team) {
                res.send("Error!");
                return;
            }
            User.find(
                {
                    _id: { $in: team.players }
                }, function (err, players) {
                    if (err) {
                        res.send("MAJOR ERROR");
                    }
                    team = team.toJSON();
                    //players = players.toJSON();
                    returnData.team = team;
                    returnData.team.players = players;
                    

                    res.json(returnData);
                })
        }).populate('captain', 'name')
});


//Returns all teams by userID
router.get('/view/myteams/:userID', function(req, res){
    let userID = req.params.userID;
    console.log(userID);

    Team.find(
    {
        players: userID
    }, function(err, team){
        if(err) return res.status(500).send("there was a problem finding the users teams");
        res.status(200).send(team);
    });
});

//Returns all teams by userID FROM TOKEN
router.get('/team/team/profile', auth, function(req, res){
    let userID = req.payload._id;
    console.log(userID);

    Team.find(
    {
        players: userID
    }, function(err, team){
        if(err) return res.status(500).send("there was a problem finding the users teams");
        res.status(200).send(team);
    });
});




//Deletes a single team from the database. Does not delete the users that were associated with the team. This works.
router.delete('/:id', function (req, res) {
    Team.findByIdAndRemove(req.params.id, function (err, team) {
        if (err) return res.status(500).send("There was a problem deleting the team.");
        res.status(200).send("Team " + team.name + " was deleted.");
    });
});




//Updates a single team in the database
router.put('/:id', function (req, res) {
    Team.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, team) {
        if (err) return res.status(500).send("There was a problem updating the team.");
        res.status(200).send(team);
    });
});





//Gets a teams upcoming matches by their teamID
router.get('/:teamID/upcomingGames', function(req, res){
    let teamID= req.params.teamID;
    let x = new Date(new Date().setDate(new Date().getDate()));
    console.log("x = " + x);
    
    Match.find({
        teams: teamID,
        //startDate: {$lt: new Date()},
        //startDate: {$gte: new Date(new Date().setDate(new Date().getDate()))},
    }, function(err,match){
        if(err) return res.status(500).send("There was a problem finding the teams upcoming games")
        res.status(200).send(match);
        console.log(Date());
        
    })
})




module.exports = router;