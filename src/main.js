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
		var now = new Date;
		var data = {
				// labels: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				labels: [
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes(),
					now.getDate()+'-'+(now.getMonth()+1)+' '+now.getHours()+':'+now.getMinutes()
					],
				datasets: [{
						label: "Your data",
						fillColor: "#F44336",
						strokeColor: "#F44336",
						pointHighlightFill: "#F44336",
						data: [11,13,6,18,14,12,14,14,12,10,11,10,13,5,9,10,12,11,10,11,13,12,15,10]
				}, {
						label: "Google Maps",
						fillColor: "rgba(0,0,0,0)",
						strokeColor: "#000",
						pointHighlightFill: "#000",
					  data: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
				}]
		};
		var options = {
				// showScale: false,
				bezierCurveTension: 0.3,
				pointDot: false,
				pointDotRadius: 4,
				pointHitDetectionRadius: 20,
				datasetStroke: false,
				datasetStrokeWidth: 0,
				datasetFill: true,
				tooltipTitleFontFamily: "-apple-system, system, sans-serif"

		};
		var ctx = document.getElementById("myChart").getContext("2d");
		Chart.defaults.global.responsive = true;
		var myLineChart = new Chart(ctx).Line(data, options);
	}

	graph();
// })();