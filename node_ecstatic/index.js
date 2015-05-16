/*jslint node: true */
'use strict';

// Declare variables used
var app, base_url, client, express, hbs, io, port, rtg, subscribe, room_counter,request, async;

// Define values
request = require('request');
express = require('express');
app = express();
port = process.env.PORT || 8888;
base_url = process.env.BASE_URL || 'http://localhost:8888';
hbs = require('hbs');
async = require('async');
// Set up connection to Redis
/* istanbul ignore if */
if (process.env.REDISTOGO_URL) {
    rtg  = require("url").parse(process.env.REDISTOGO_URL);
    client = require("redis").createClient(rtg.port, rtg.hostname);
    subscribe = require("redis").createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
    subscribe.auth(rtg.auth.split(":")[1]);
} else {
    client = require('redis').createClient();
    subscribe = require('redis').createClient();
}

// Set up templating
app.set('views', __dirname + '/views');
app.set('view engine', "hbs");
app.engine('hbs', require('hbs').__express);

// Register partials
hbs.registerPartials(__dirname + '/views/partials');

// Set URL
app.set('base_url', base_url);

// Define index route
app.get('/', function (req, res) {
    res.render('index');
});

// Serve static files
app.use(express.static(__dirname + '/static'));

// Listen
io = require('socket.io')({
}).listen(app.listen(port));
console.log("Listening on port " + port);

// Handle new messages
io.sockets.on('connection', function (socket) {

    //Joins an existing room
    socket.on('get_room_for_user', function (data) {
        client.get(data.username, function(err, room_number) {
            //add yourself to the users list
            client.hmset('list_of_users:'+room_number, 'username', data.username);
        });
    });

    //Joins an existing room
    socket.on('join_room', function (data) {
        client.get(data.user_id, function(err, room_number) {
            //add yourself to the users list
            client.hmset('list_of_users:'+room_number, 'username', data.username);
        });
    });

    //creates a new room
    socket.on('create_room', function (data) {
        client.get('room_counter', function(err, room_counter) {
            if(!room_counter){
                client.set('room_counter', 0, function(err, room_counter) {
                    if(err) console.log(err);
                });
                room_counter = 0;
            }
            var params = JSON.parse(data);
            client.hmset(':1:room:'+room_counter, "room_name", params.room_name, "room_number", room_counter, "number_of_users", 1, function (err, val){

            });    //create a new hashmap with the room number
            client.set(":1:"+params.username+":room", room_counter);        //create a key-value for the username (mweiss17) to the room_id
            client.incr('room_counter');         //increment the number of rooms 

            // emit room_info 
            client.hgetall(':1:room:'+room_counter, function(err, room_info){
                socket.emit('create_room', room_info);
            });

            // set list_of_users
           //client.hmset('list_of_users:'+room_counter, "username", data.username);

            // set playlist
            //client.hmset(':1:room:'+room_counter+':playlist, "");

            // set player
            //client.hmset('player:'+room_counter, 'is_playing', false, 'playertime', 0);
        });
    });
    
    function get_room_name(location, callback){
        client.hgetall(':1:room:'+location.room_number, function (err, room_info) {
            try{
                location.room_name = room_info.room_name;
                location.number_of_users = room_info.number_of_users;
                callback(null, location);
            }
            catch(err){
                .log(.log("caught error, room_info="+room_info);
            }
        });
    }    

    //Joins an existing room
    socket.on('get_rooms_around_me', function (data) {
        console.log("get_rooms_around_me_data="+data);
        var params = JSON.parse(data);
        console.log("params="+params);
        console.log("username="+params.username);

        //get distances to each room
        request('http://54.173.157.204/geo/get_nearest_users/?username='+params.username, function (error, response, body) {
            var jsonLocations = JSON.parse(body);
            console.log(jsonLocations);
            async.map(jsonLocations.locations, get_room_name, function(err, result){
                    if(!err){
                        socket.emit('get_rooms_around_me', jsonLocations);
                    }
                }
            );
        });

        //get name of each room
        //get image link of each room
        //get list of users
    });
    socket.on('subscribe_to_playlist', function (data) {
        
    });

    socket.on('add_song', function (data) {
        console.log(data);
        console.log("params="+params);
        console.log("username="+params.media_item);
        client.lpush(':1:room:'+room_counter+':playlist', "media_item":data.media_item);
    });
});