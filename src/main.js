/**
 * Scripts for maps checker.
 * @author Haroen Viaene <hello@haroen.me>
 * @version 0.3
 */

// (function() {

	//variables
	var googleTravelTime;
	var graph;
	var map;

	/**
	 * add a notice, removeable by clicking the 'close button'
	 * Creates <p class="notice"><span class="notice--close"></span>text</p>
	 * @param  {string} text the notice text
	 * @author Haroen Viaene <hello@haroen.me>
	 * @license https://github.com/haroenv/notice CC-4.0-BY
	 */
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
	 * Make the search results appear
	 * save to localstorage
	 * display the travel time
	 * todo: do the search
	 */
	 var calculate = function() {
	 	var search = document.querySelector('.search');
	 	var from = document.getElementById('from').value;
	 	var to = document.getElementById('to').value;
	 	var mode = document.getElementById('mode').value;
	 	var submit = search.getElementsByTagName('button')[0];

	 	var directionsService = new google.maps.DirectionsService;
	 	var directionsDisplay = new google.maps.DirectionsRenderer;
	 	map = new google.maps.Map(document.getElementById('map'), {
	 		zoom: 7,
	 		center: {lat: 50.43, lng: 4.36}
	 	});
	 	directionsDisplay.setMap(map);

	  // var onChangeHandler = function() {
	  //   calculateAndDisplayRoute(directionsService, directionsDisplay);
	  // };
	  // document.getElementById('submit').addEventListener('click', onChangeHandler)

	  submit.addEventListener('click',function(){
	  	document.querySelector('.result--number').innerHTML = googleTravelTime;
	  	from = document.getElementById('from').value;
	  	to = document.getElementById('to').value;
	  	mode = document.getElementById('mode').value;
	  	window.localStorage.setItem('from',from);
	  	window.localStorage.setItem('to',to);
	  	window.localStorage.setItem('mode',mode);
		//todo: search on google
		var x = calculateAndDisplayRoute(directionsService, directionsDisplay, from, to, mode);
		console.log(x);
		googleTravelTime = 10;
		// notice('requested search from ' + from + ' to ' + to + ' by ' + mode);
		initGraph();
		});
	};


	/**
	 * get the values the logs stored in localStorage
	 * @return {array} the values
	 */
	 var getDataValues = function() {
	 	var data = [];
	 	(JSON.parse(window.localStorage.getItem('data')) || []).forEach(function(e,i){
	 		data.push(e.value);
	 	});
	 	return data;
	 }

	/**
	 * get the values of Google maps the logs stored in localStorage
	 * @return {array} the values
	 */
	 var getDataGoogleValues = function() {
	 	var data = [];
	 	(JSON.parse(window.localStorage.getItem('data')) || []).forEach(function(e,i){
	 		data.push(e.google);
	 	});
	 	return data;
	 }

	/**
	 * Get the times stored in localStorage
	 * @return {array} the times a log occured
	 */
	 var getDataTimes = function() {
	 	var data = [];
	 	(JSON.parse(window.localStorage.getItem('data')) || []).forEach(function(e,i){
	 		var date = new Date(e.time);
	 		data.push(date.getDate() + '-' + (date.getMonth() + 1) + ' ' + date.getHours() + ':' + date.getMinutes());
	 	});
	 	return data;
	 }

	/**
	 * Show the graph
	 */
	 var initGraph = function() {
	 	graph ? graph.destroy() : null;
	 	var ctx = document.getElementById("myChart").getContext("2d");
	 	Chart.defaults.global.responsive = true;
	 	graph = new Chart(ctx).Line({
	 		labels: getDataTimes(),
	 		datasets: [{
	 			label: "Your data",
	 			fillColor: "#F44336",
	 			strokeColor: "#F44336",
	 			pointHighlightFill: "#F44336",
	 			data: getDataValues()
	 		}, {
	 			label: "Google Maps",
	 			fillColor: "rgba(0,0,0,0)",
	 			strokeColor: "#000",
	 			pointHighlightFill: "#000",
	 			data: getDataGoogleValues()
	 		}]
	 	}, {
	 		bezierCurveTension: 0.3,
	 		pointDot: false,
	 		datasetStroke: false,
	 		datasetStrokeWidth: 0,
	 		datasetFill: true,
	 		tooltipTitleFontFamily: "-apple-system, system, sans-serif"

	 	});
	 }

	/**
	 * logging your own estimate
	 */
	 var log = function() {
	 	var results = document.querySelector('.result');
	 	var estimate = results.querySelector('.result--number');
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


	// function initMap() {
	//   var directionsService = new google.maps.DirectionsService;
	//   var directionsDisplay = new google.maps.DirectionsRenderer;
	//   map = new google.maps.Map(document.getElementById('map'), {
	//     zoom: 7,
	//     center: {lat: 50.43, lng: 4.36}
	//   });
	//   directionsDisplay.setMap(map);

	//   var onChangeHandler = function() {
	//     calculateAndDisplayRoute(directionsService, directionsDisplay);
	//   };
	//   document.getElementById('submit').addEventListener('click', onChangeHandler)
	// }

	var  calculateAndDisplayRoute = function(directionsService, directionsDisplay, from, to, mode) {
		directionsService.route({
			origin: from,
			destination: to,
			travelMode: mode
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				return response.routes[0].legs[0].duration.value;
			} else {
				notice('Directions request failed due to ' + status);
			}
		});
	}


	// cookie notice
	if (!window.localStorage.cookie)  {
		window.localStorage.setItem('cookie',true);
		notice('This site uses cookies to function. By continuing to use this site you agree to save local cookies. ');
	}

	window.onload = function() {
		loadSearchFromStorage();
		// initMap();
		calculate();
		log();
		initGraph();
		document.getElementById('submit').click();
	}


// })();