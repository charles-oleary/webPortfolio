// This is where the main JS of my portfolio project will be held.

var teamUrl = "https://statsapi.web.nhl.com/api/v1/teams/";
var playerUrl = "https://statsapi.web.nhl.com/api/v1/people/";
var players = [];

//Hockey functions
function getPlayerStats() {
	event.preventDefault();
	var team = $("#hockeyTeamDropdown").val();
	$("#playerTable").html("<tr> <th>Name: </th> <th>Games:</th> <th>Points</th> <th>Goals</th> <th>Assists:</th></tr>");
	$.ajax({
		url: teamUrl + team + "/roster",
		method: 'GET',
		dataType: 'json'
	}).done(function(data){
		players = [];
		for(var i = 0; i < Object.keys(data.roster).length; i++) {
			if(data.roster[i].position.code != "G") { // Exclude Goalies
				var name = data.roster[i].person.fullName;
				var playerId = data.roster[i].person.id;
				retrieveStats(name, playerId); //Get stats for each player
			} 
		}

		setTimeout(function() {
			players.sort(function(a, b) {
				return b.points - a.points;
			});
			for(var i = 0; i < players.length; i++) {
				$("#playerTable").append("<tr> <td>" + players[i].name +  "</td> <td>" +players[i].games + "</td> <td>" + players[i].points + "</td> <td>" + players[i].goals + "</td> <td>" + players[i].assists + "</td> </tr>");
			} 
		}, 1000);
		
	}).fail(function(error){
		console.log("error: ", error);
	}); //End AJAX
}



function retrieveStats(name, playerId) {
	$.ajax({
		url: playerUrl + playerId + "/stats?stats=statsSingleSeason&season=20202021",
		method: 'GET'
	}).done(function(data){
		var games = data.stats[0].splits[0].stat.games;
		var points = data.stats[0].splits[0].stat.points;
		var goals = data.stats[0].splits[0].stat.goals;
		var assists = data.stats[0].splits[0].stat.assists;
		let element = {name: name, pid: playerId, games: games, points: points, goals: goals, assists: assists};  //Creates player object with their stats
		players.push(element); //Adds player to players array
	}).fail(function(error){
		console.log("error: ", error.message);
	});
	
}

// ---------------------- WEATHER JS ----------------------- //

var url = "https://api.openweathermap.org/data/2.5/weather?lat=";
var url2 = "&units=imperial&appid=b2d9d524291c01b5573264d0cd6388a0";

var x = document.getElementById("weatherJumbo");

function getWeather() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
		showNonGeo()
	} else {
		console.log("navigator does not work");
	}
}

function showPosition(position) {
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	
	$.ajax({
		url: url + lat + "&lon=" + lon + url2,
		method: 'GET'
	}).done(function (data){
		console.log(data);
		$("#weatherJumbo").append("<h3>" + data.name + "</h3>");
		$("#weatherJumbo").append("<h6> Current Temp: " + data.main.temp + " <span>&#176;</span>F</h6>");
		$("#weatherJumbo").append("<h6> Feels Like: " + data.main.feels_like + " <span>&#176;</span>F</h6>");
		var icon = data.weather[0].icon;
		var weather = data.weather[0].description;
		$("#weatherIcon").append("<img src='http://openweathermap.org/img/w/" + icon + ".png' width='100' height='100'>");
		$("#weatherJumbo").append("<p>Description: " + weather + "</p>");

	}).fail(function(error){

	});
}

function showNonGeo() {
	$("#weatherContainer").append("<form id='weatherForm'></br><p>Enter Zip Code:</p><input type='number' id='zipcode'></br> <button type='button' onclick='getNonGeo()' class='btn btn-secondary'>Submit for Weather:</button></form>");
}

function getNonGeo() {
	var nonGURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
        var nonGURL2 = "&units=imperial&appid=b2d9d524291c01b5573264d0cd6388a0";
	var zip = $("#zipcode").val();
	$.ajax({
		url: nonGURL + zip + nonGURL2,
		method: 'GET'
	}).done(function(data){
		$("#weatherJumbo").html("<div id='weatherIcon'></div>");
		
		$("#weatherJumbo").append("<h3>" + data.name + "</h3>");
                $("#weatherJumbo").append("<h6> Current Temp: " + data.main.temp + " <span>&#176;</span>F</h6>");
                $("#weatherJumbo").append("<h6> Feels Like: " + data.main.feels_like + " <span>&#176;</span>F</h6>");
                var icon = data.weather[0].icon;
                var weather = data.weather[0].description;
                $("#weatherIcon").append("<img src='http://openweathermap.org/img/w/" + icon + ".png' width='100' height='100'>");
		$("#weatherJumbo").append("<p>Description: " + weather + "</p>");
	}).fail(function(error) {

	});
}

// ---------------------------------Movie functions --------------------------- //

function showMovies() {
	var upcoming = "https://api.themoviedb.org/3/movie/upcoming?api_key=b2431a4d81bea2d2193dc627b2a8e4d4&language=en-US&page=";
	var images = "http://image.tmdb.org/t/p/w500/";
	for(var i = 0; i < 10; i++) {
		$.ajax({
			url: upcoming + i,
			method: 'GET'
		}).done(function(data){
			console.log(data);
			for(var i = 0; i < data.results.length; i++) {
				$("#movieList").append("<div class='card'><img src='" + images + data.results[i].poster_path + "'width='100' height='150' alt='no poster found'></img> <div class='conatiner'><p>" + data.results[i].title.substring(0,30) + "</p><p>"+ data.results[i].release_date + "</p></div></div>");
			}
			
		}).fail(function(error){
			console.log("error: ", error.message);
		});
	}
}


