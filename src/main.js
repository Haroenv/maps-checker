/**
** Scripts for maps checker.
** @author Haroen Viaene <hello@haroen.me>
** @version 0.4
**/

(function() {

	/** The time that will be returned by google */
	var googleTravelTime;
	/** the graph */
	var graph;
	/** The map */
	var map;

	/**
	 * add a notice, removeable by clicking the 'close button'
	 * Creates <p class='notice'><span class='notice--close'></span>text</p>
	 *
	 * @param  {string} text the notice text
	 * @author Haroen Viaene <hello@haroen.me>
	 * @license https://github.com/haroenv/notice CC-4.0-BY
	 *
	 * see also: style declaration:
	 *
	 * .notice {
	 * 	font-size: .8em;
	 * 	background-color: #9E9E9E;
	 * 	padding: .2rem;
	 * 	margin: 0;
	 * 	flex: 0;
	 * 	display: flex;
	 * 	align-items: center;
	 * }
	 * .notice--close {
	 * 	width: 1.25em;
	 * 	height: 1.25rem;
	 * 	margin: 0 .5em;
	 * 	cursor: pointer;
	 * 	user-select: none;
	 * }
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

	/**
	 * Load to, from and mode from localStorage into their inputs
	 */
	var loadSearchFromStorage = function() {
		document.getElementById('from').value = localStorage.getItem('from');
		document.getElementById('to').value = localStorage.getItem('to');
		document.getElementById('mode').value = localStorage.getItem('mode');
	}

	/**
	 * make all search elemens enabled
	 */
	var enableSearch = function() {
		document.getElementById('from').disabled = false;
		document.getElementById('to').disabled = false;
		document.getElementById('mode').disabled = false;
	}

	/**
	 * make the search elements disabled
	 */
	var disableSearch = function() {
		document.getElementById('from').disabled = true;
		document.getElementById('to').disabled = true;
		document.getElementById('mode').disabled = true;
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
		var submit = document.getElementById('submit');
		var edit = document.getElementById('edit');

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
			localStorage.setItem('from',from);
			localStorage.setItem('to',to);
			localStorage.setItem('mode',mode);
			calculateAndDisplayRoute(directionsService, directionsDisplay, from, to, mode,function(expected){
				console.log('duration (directions/function): ' + parseInt(expected / 60,10) + ' minutes');
				if (mode === 'DRIVING') {
					durationInTraffic(from, to, mode, function(exp){
						console.log('duration_in_traffic (distance/XHR): ' + parseInt(exp / 60,10) + ' minutes');
						if (exp) {
							setExpected(exp);	
						} else {
							notice('Directions in traffic didn\'t work on this system.');
							setExpected(expected);					
						}
					});
				} else {
					setExpected(expected);
				}
			});
		});

		/**
		 * if you click on 'edit', you'll:
		 * 1. delete the info
		 * 2. redraw the graph
		 * 3. make the inputs enabled again
		 */
		edit.addEventListener('click',function(){
			if (confirm('Are you sure you want to edit the parameters?')) {
				clearLogs();
				initGraph();
				enableSearch();
			};
		});
	};

	/**
	 * Set the expected type to the result--number (in minutes)
	 * redraw the graph
	 * disable the search
	 * @param {int} expected the time in seconds
	 */
	var setExpected = function(expected) {
		googleTravelTime = parseInt(expected / 60,10);
		document.querySelector('.result--number').innerHTML = googleTravelTime;
		initGraph();
		disableSearch();
	}

	/**
	 * clear the logs of data, from, to and mode
	 */
	var clearLogs = function() {
		localStorage.removeItem('data');
		localStorage.removeItem('from');
		localStorage.removeItem('to');
		localStorage.removeItem('mode');
	}

	/**
	 * get the values the logs stored in localStorage
	 * @return {array} the values
	 */
	var getDataValues = function() {
		var data = [];
		(JSON.parse(localStorage.getItem('data')) || []).forEach(function(e,i){
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
		(JSON.parse(localStorage.getItem('data')) || []).forEach(function(e,i){
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
		(JSON.parse(localStorage.getItem('data')) || []).forEach(function(e,i){
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
		var ctx = document.getElementById('graph').getContext('2d');
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
	 * logging your own estimate
	 */
	var initLog = function() {
		var results = document.querySelector('.result');
		var estimate = results.querySelector('.result--number');

		/**
		 * click on the "log" button when key is enter
		 */
		estimate.addEventListener('keydown',function(e){
			if (e.keyCode === 13) {
				log.click();
				e.preventDefault();
			}
		});
		var log = results.querySelector('.result--button');

		/**
		 * saving your own guess and google's guess with the unix timestamp as time
		 */
		log.addEventListener('click',function(){
			var est = estimate.innerHTML.replace(/\s+/g, '').replace(/,/g,'.');
			if (isNaN(est)) {
				notice(est + ' is not a number');
			} else {
				var data = JSON.parse(localStorage.getItem('data')) || [];
				data.push({time: Date.now(),value: est,google: (googleTravelTime ? googleTravelTime : (data.length ? data[data.length-1].google : 0))});
				localStorage.setItem('data',JSON.stringify(data));
				initGraph();
			}
		});
	}

	/**
	 * The google distance matrix api used server side with a php mirror
	 * used only to return the `duration_in_traffic`
	 * BEWARE: google maps pretends to take the mode in account, but it doesn't, it always returns
	 * the directions for DRIVING
	 * @param  {google.maps.DistanceMatrixService}   distanceService
	 * @param  {string}   from            the starting location
	 * @param  {string}   to              the ending location
	 * @param  {string}   mode            the travel mode (DRIVING/TRANSIT/BICYCLING/WALKING)
	 * @param  {Function} callback        the function that returns only the `duration_in_traffic`
	 */
	var durationInTraffic = function(from, to, mode, callback) {
		var params = 'from='+from+'&to='+to+'&mode='+mode;
		var address = 'src/distancematrix.php';
		var req = new XMLHttpRequest();
		req.addEventListener('load', function(){
			if (typeof callback === 'function') {
				try {
					callback(JSON.parse(this.responseText).rows[0].elements[0].duration_in_traffic.value);
				} catch (e) {
					callback(false);
				}
			}
		});
		req.open('POST',address);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send(params);
	}

	/**
	 * The google directions service api
	 * used to return the `duration` and display the map
	 * @param  {google.maps.DirectionsService}   directionsService
	 * @param  {google.maps.DirectionsDisplay}   directionsDisplay
	 * @param  {string}   from            the starting location
	 * @param  {string}   to              the ending location
	 * @param  {string}   mode            the travel mode (DRIVING/TRANSIT/BICYCLING/WALKING)
	 * @param  {Function} callback        the function that returns only the `duration`
	 */
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
	 * Save the graph
	 * todo: namespacing and getById consistency
	 */
	var saveGraph = function() {
		var img = graph.toBase64Image();
		document.getElementById('test').src = img;
		var images = JSON.parse(localStorage.getItem('images')) || [];
		images.push(img);
		localStorage.setItem('images',JSON.stringify(images));
	}

	// cookie notice
	if (!localStorage.cookie)  {
		localStorage.setItem('cookie',true);
		notice('This site uses cookies to function. By continuing to use this site you agree to save local cookies. ');
	}

	/**
	 * Things to do on load
	 * 1. load the search from storage
	 * 2. initialise the search function
	 * 3. Initialise the logging function
	 * 4. Initialise the graph
	 * 5. add the event listener to the save button
	 * todo: finish the save button
	 */
	window.onload = function() {
		loadSearchFromStorage();
		calculate();
		initLog();
		initGraph();
		document.getElementById('submit').click();
		document.querySelector('.extra--save').addEventListener('click',function(){
			saveGraph();
		});
	}

	/*
	 * google analytics
	 */
	window.ga = window.ga || function() {
		(ga.q = ga.q||[]).push(arguments);
	};
	ga.l = +new Date;
	ga('create', 'UA-27277115-3', 'auto');
	ga('send', 'pageview');

	/*
	 * listener on resize to reload graph
	 * Will refresh the graph if there is 250 ms after a resize event
	 */
	var resizeTimer;
	window.addEventListener('resize', function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			initGraph();
		}, 250);
	});

})();
