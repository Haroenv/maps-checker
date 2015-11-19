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

		if ("webkitAppearance" in document.body.style) {
			close.style.webkitAppearance = "searchfield-cancel-button";
		} else {
			close.appendChild(document.createTextNode('✕'));
		}

		document.body.insertBefore(notice, document.body.firstChild);

		close.addEventListener('click',function(){
			document.body.removeChild(notice);
		});
	};

	// cookie notice
	notice('This site uses cookies to function. By continuing to use this site you agree to save local cookies. ');

	/**
	 * Set a certain level to the progress element
	 * IMPORTANT: only one progress element per page.
	 * @param  {float} level the level of the progress (0-1)
	 */
	var progress = function(level) {
		document.getElementsByTagName('progress')[0].value = level;
	};

	// set a progress of .5 to test it out.
	progress(.5);

	/**
	 * Make the search results appear
	 */
	var calculate = function() {
		var search = document.querySelector('.search');
		// todo: find out why this works
		// var submit = search.getElementsByTagName('button');
		submit.addEventListener('click',function(){
			notice('clicked');
		});
	};

	calculate();

	/**
	 * Show the graph
	 * TODO: populate
	 * @return {[type]} [description]
	 */
	var graph = function() {
		var data = {
				labels: ["6 AM", "8 AM", "10 AM", "12 AM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 PM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM"],
				datasets: [{
						label: "2015",
						fillColor: "rgba(239,217,194,0.8)",
						strokeColor: "#EFD9C2",
						pointHighlightFill: "#EFD9C2",
					  data: [6, 8, 19, 15, 12, 15, 16, 15, 13, 10, 8, 12, 13, 14, 13, 14, 15]
				}, {
						label: "2014",
						fillColor: "rgba(255,162,180,0.8)",
						strokeColor: "#FFA2B4",
						pointHighlightFill: "#FFA2B4",
						data: [8, 13, 16, 18, 14, 12, 14, 14, 12, 10, 8, 10, 13, 8, 7, 10, 12]
				}, {
						label: "2013",
						fillColor: "rgba(189,224,254,0.8)",
						strokeColor: "#BDE0FE",
						pointHighlightFill: "#BDE0FE",
						data: [5, 7, 9, 8, 6, 6, 9, 15, 16, 12, 8, 5, 3, 5, 5, 8, 10]
				}]
		};
		var options = {
				showScale: false,
				bezierCurveTension: 0.4,
				pointDot: false,
				pointDotRadius: 4,
				pointHitDetectionRadius: 20,
				datasetStroke: false,
				datasetStrokeWidth: 0,
				datasetFill: true,
				tooltipTitleFontFamily: "Varela Round"

		};
		var ctx = document.getElementById("myChart").getContext("2d");
		Chart.defaults.global.responsive = true;
		var myLineChart = new Chart(ctx).Line(data, options);
	}

	graph();
// })();