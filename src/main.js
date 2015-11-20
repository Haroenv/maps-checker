/**
 * Scripts for maps checker.
 * @author Haroen Viaene <hello@haroen.me>
 */

// (function() {
	//todo: remove in prod
	console.log('Aight.');

	/**
	 * add a notice, removeable by clicking the 'close button'
	 * Creates <p class="notice"><span class="notice--close"></span>text</p>
	 * @param  {string} text the notice text
	 */
	var notice = function(text){
		var notice = document.createElement('p');
		var close = document.createElement('span');
		var content = document.createTextNode(text);

		notice.appendChild(close);
		notice.appendChild(content);

		close.className += 'notice--close';
		notice.className += 'notice';

		// if ("webkitAppearance" in document.body.style) {
		// 	close.style.webkitAppearance = "searchfield-cancel-button";
		// } else {
		close.appendChild(document.createTextNode('✕'));
		// }

		document.body.insertBefore(notice, document.body.firstChild);

		close.addEventListener('click',function(){
			document.body.removeChild(notice);
		});
	};

	// cookie notice
	notice('This site uses cookies to function. By continuing to use this site you agree to save local cookies. ');

	var loadMaps = function() {
		document.getElementById('from').value = window.localStorage.getItem('from');
		document.getElementById('to').value = window.localStorage.getItem('to');
		document.getElementById('mode').value = window.localStorage.getItem('mode');
	}

	loadMaps();

	/**
	 * Make the search results appear
	 * todo: do the search
	 */
	var google;
	var calculate = function() {
		var search = document.querySelector('.search');
		var from = document.getElementById('from').value;
		var to = document.getElementById('to').value;
		var mode = document.getElementById('mode').value;
		var submit = search.getElementsByTagName('button')[0];
		submit.addEventListener('click',function(){
			//todo: search on google
			google = 10;
			document.querySelector('.result--number').value = google;
			from = document.getElementById('from').value;
			to = document.getElementById('to').value;
			mode = document.getElementById('mode').value;
			window.localStorage.setItem('from',from);
			window.localStorage.setItem('to',to);
			window.localStorage.setItem('mode',mode);
			notice('requested search from ' + from + ' to ' + to + ' by ' + mode);
		});
	};

	calculate();

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
	var graph;
	var initGraph = function() {
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
					  data: getDataGoogleVaulues()
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

	initGraph();

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
				data.push({time: Date.now(),value: est,google: google});
				window.localStorage.setItem('data',JSON.stringify(data));
			}

		});
		graph ? graph.update() : notice('The graph didn\'t load yet');
	}

	log();

// })();