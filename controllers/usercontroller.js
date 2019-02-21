var express = require('express');
var router = express.Router();
var auth = require('../config/auth');


var User = require('../models/user');



//Returns all the users in the database
router.get('/', function (req, res)
{
    User.find({}, function (err, users)
    {
        if(err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

//Returns all the users in the database
router.get('/leagueManager', function (req, res)
{
    User.find({ "role" : "league manager"}, function (err, users)
    {
        if(err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});






//Gets a single user from the database
router.get('/:id', function(req, res)
{
    User.findById(req.params.id, function(err, user) 
    {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if(!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

//GETS A SINGLE USER FROM THE DATABASE LUKE

router.get('/profile/view',auth,function(req,res,next){

    User.findOne({
        _id: req.payload._id
    }, function(err, user){
        if(err) return res.status(500).send("there was an error finding the user.");
        res.status(200).send(user);
    })
});





//Deletes a single user from the database
router.delete('/:id', function (req, res) 
{
    User.findByIdAndRemove(req.params.id, function(err,user) 
    {
        if(err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ user.name + " was deleted.");
    });
});

//Updates a single user in the database
router.put('/update', function (req, res) 
{
    User.findByIdAndUpdate(req.body._id, req.body, {new: false}, function(err, user)
    {
        if(err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
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