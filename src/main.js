/**
** Scripts for maps checker.
** @author Haroen Viaene <hello@haroen.me>
** @version 0.3
**/

// (function() {

	//variables
	var googleTravelTime;
	var graph;
	var map;

	/**
	** add a notice, removeable by clicking the 'close button'
	** Creates <p class='notice'><span class='notice--close'></span>text</p>
	** @param  {string} text the notice text
	** @author Haroen Viaene <hello@haroen.me>
	** @license https://github.com/haroenv/notice CC-4.0-BY
	** see also: style declaration:
	**
	** .notice {
	** 	font-size: .8em;
	** 	background-color: #9E9E9E;
	** 	padding: .2rem;
	** 	margin: 0;
	** 	flex: 0;
	** 	display: flex;
	** 	align-items: center;
	** }
	** .notice--close {
	** 	width: 1.25em;
	** 	height: 1.25rem;
	** 	margin: 0 .5em;
	** 	cursor: pointer;
	** 	user-select: none;
	** }
	**/
	var notice = function(text){
		var notice = document.createElement('p');
		var close = document.createElement('span');
		var content = document.createTextNode(text);

		notice.appendChild(close);
		notice.appendChild(content);

		close.className += 'notice--close';
		notice.className += 'notice';

		close.appendChild(document.createTextNode('✕'));

		document.body.insertBefore(notice, document.body.firstChild);

		close.addEventListener('click',function(){
			document.body.removeChild(notice);
		});
	};

	var loadSearchFromStorage = function() {
		document.getElementById('from').value = window.localStorage.getItem('from');
		document.getElementById('to').value = window.localStorage.getItem('to');
		document.getElementById('mode').value = window.localStorage.getItem('mode');
	}

	/**
	** Make the search results appear
	** save to localstorage
	** display the travel time
	** todo: do the search
	**/
	var calculate = function() {
		var search = document.querySelector('.search');
		var from = document.getElementById('from').value;
		var to = document.getElementById('to').value;
		var mode = document.getElementById('mode').value;
		var submit = search.getElementsByTagName('button')[0];

		if (typeof google === 'undefined') {
			notice('Your internet connection is offline.');
			return;
		}

		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var distanceService = new google.maps.DistanceMatrixService();
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 7,
			center: {lat: 50.43, lng: 4.36}
		});
		directionsDisplay.setMap(map);
		var trafficLayer = new google.maps.TrafficLayer();
		trafficLayer.setMap(map);

		submit.addEventListener('click',function(){
			from = document.getElementById('from').value;
			to = document.getElementById('to').value;
			mode = document.getElementById('mode').value;
			window.localStorage.setItem('from',from);
			window.localStorage.setItem('to',to);
			window.localStorage.setItem('mode',mode);
			calculateAndDisplayRoute(directionsService, directionsDisplay, from, to, mode,function(expected){
				console.log('duration (directions/function): ' + parseInt(expected / 60,10) + ' minutes');
				// googleTravelTime = parseInt(expected / 60,10);
				// document.querySelector('.result--number').innerHTML = googleTravelTime;
				// initGraph();
			});
			distancematrix(distanceService, from, to, mode,function(expected){
				console.log('duration (distance/function): ' + parseInt(expected / 60,10) + ' minutes');
				// googleTravelTime = parseInt(expected / 60,10);
				// document.querySelector('.result--number').innerHTML = googleTravelTime;
				// initGraph();
			});
			durationInTraffic(from, to, mode, function(expected){
				googleTravelTime = parseInt(expected / 60,10);
				console.log('duration_in_traffic (distance/XHR): ' + parseInt(expected / 60,10) + ' minutes');
				document.querySelector('.result--number').innerHTML = googleTravelTime;
				initGraph();
			});
		});
};

	/**
	** get the values the logs stored in localStorage
	** @return {array} the values
	**/
	var getDataValues = function() {
		var data = [];
		(JSON.parse(window.localStorage.getItem('data')) || []).forEach(function(e,i){
			data.push(e.value);
		});
		return data;
	}

	/**
	** get the values of Google maps the logs stored in localStorage
	** @return {array} the values
	**/
	var getDataGoogleValues = function() {
		var data = [];
		(JSON.parse(window.localStorage.getItem('data')) || []).forEach(function(e,i){
			data.push(e.google);
		});
		return data;
	}

	/**
	** Get the times stored in localStorage
	** @return {array} the times a log occured
	**/
	var getDataTimes = function() {
		var data = [];
		(JSON.parse(window.localStorage.getItem('data')) || []).forEach(function(e,i){
			var date = new Date(e.time);
			data.push(date.getDate() + '-' + (date.getMonth() + 1) + ' ' + date.getHours() + ':' + date.getMinutes());
		});
		return data;
	}

	/**
	** Show the graph
	**/
	var initGraph = function() {
		graph ? graph.destroy() : null;
		var ctx = document.getElementById('myChart').getContext('2d');
		Chart.defaults.global.responsive = true;
		graph = new Chart(ctx).Line({
			labels: getDataTimes(),
			datasets: [{
				label: 'Your data',
				fillColor: '#F44336',
				strokeColor: '#F44336',
				pointHighlightFill: '#F44336',
				data: getDataValues()
			}, {
				label: 'Google Maps',
				fillColor: 'rgba(0,0,0,0)',
				strokeColor: '#000',
				pointHighlightFill: '#000',
				data: getDataGoogleValues()
			}]
		}, {
			bezierCurveTension: 0.3,
			pointDot: false,
			datasetStroke: false,
			datasetStrokeWidth: 0,
			datasetFill: true,
			tooltipTitleFontFamily: '-apple-system, system, sans-serif'
		});
	}

	/**
	** logging your own estimate
	**/
	var log = function() {
		var results = document.querySelector('.result');
		var estimate = results.querySelector('.result--number');

		/**
		** click on the "log" button when key is enter
		**/
		estimate.addEventListener('keydown',function(e){
			if (e.keyCode === 13) {
				log.click();
				e.preventDefault();
			}
		});
		var log = results.querySelector('.result--button');
		log.addEventListener('click',function(){
			var est = estimate.innerHTML.replace(/\s+/g, '').replace(/,/g,'.');
			if (isNaN(est)) {
				notice(est + ' is not a number');
			} else {
				var data = JSON.parse(window.localStorage.getItem('data')) || [];
				data.push({time: Date.now(),value: est,google: (googleTravelTime ? googleTravelTime : (data.length ? data[data.length-1].google : 10))});
				window.localStorage.setItem('data',JSON.stringify(data));
				initGraph();
			}
		});
	}

	var durationInTraffic = function(from, to, mode, callback) {
		var key = 'AIzaSyDb0bYTaEI04ai_OaxE-GK-2flcYJOc-Zc';
		var address = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + from + '&destinations=' + to + '&key='+ key +'&travelmode=' + mode + '&departure_time=now';
		var req = new XMLHttpRequest();
		req.addEventListener('load', function(){
			if (typeof callback === 'function') {
				callback(JSON.parse(this.responseText).rows[0].elements[0].duration_in_traffic.value);
			}
		});
		req.open('GET',address);
		req.setRequestHeader('Access-Control-Allow-Origin','https://haroen.me');
		req.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With');
		req.send();
	}

	var calculateAndDisplayRoute = function(directionsService, directionsDisplay, from, to, mode, callback) {
		directionsService.route({
			origin: from,
			destination: to,
			travelMode: mode
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				if (typeof callback === 'function') {
					callback(response.routes[0].legs[0].duration.value);
				}
			} else {
				notice('Directions request failed due to ' + status);
			}
		});
	}

	/**
	** The google distance matrix api used client side
	** used only to return the `duration_in_traffic`
	** @param  {google.maps.DistanceMatrixService}   distanceService
	** @param  {string}   from            the starting location
	** @param  {string}   to              the ending location
	** @param  {string}   mode            the travel mode (DRIVING/TRANSIT/BICYCLING/WALKING)
	** @param  {Function} callback        the function that returns only the `duration_in_traffic`
	**/
	var distancematrix = function(distanceService, from, to, mode, callback) {
		distanceService.getDistanceMatrix({
			origins: [from],
			destinations: [to],
			travelMode: mode,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, function(response, status) {
			if (status !== google.maps.DistanceMatrixStatus.OK) {
				notice('Error was: ' + status);
			} else {
				callback(response.rows[0].elements[0].duration.value);
			}
		});
	}

	/**
	** Save the graph
	** todo: namespacing and getById consistency
	**/
	var saveGraph = function() {
		var img = graph.toBase64Image();
		document.getElementById('test').src = img;
		var images = JSON.parse(window.localStorage.getItem('images')) || [];
		images.push(img);
		window.localStorage.setItem('images',JSON.stringify(images));
	}

	// cookie notice
	if (!window.localStorage.cookie)  {
		window.localStorage.setItem('cookie',true);
		notice('This site uses cookies to function. By continuing to use this site you agree to save local cookies. ');
	}

	window.onload = function() {
		loadSearchFromStorage();
		calculate();
		log();
		initGraph();
		document.getElementById('submit').click();
		document.querySelector('.extra--save').addEventListener('click',function(){
			saveGraph();
		});
		document.querySelector('.extra--clear').addEventListener('click',function(){
			window.localStorage.clear();
			initGraph();
		});
	}

	/* google analytics**/
	window.ga = window.ga || function() {
		(ga.q = ga.q||[]).push(arguments);
	};
	ga.l = +new Date;
	ga('create', 'UA-27277115-3', 'auto');
	ga('send', 'pageview');

	/* listener on resize to reload graph**/
	var resizeTimer;
	window.addEventListener('resize', function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			initGraph();
		}, 250);
	});

// })();
