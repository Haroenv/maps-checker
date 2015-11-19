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
// })();