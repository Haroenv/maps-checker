# maps-checker

A comparison between google maps travel time and actual travel time.

Made for the course WebScripting 1 (Clientside) at Odisee (Ghent), lectorer by Rogier van der Linde

Live version at <http://haroenviaene.ikdoeict.be/maps> and <https://maps-checker.herokuapp.com>

There's also a github pages version that won't run all the php things at <https://haroen.me/maps-checker> (which is needed for `distance_in_traffic` and saving images).

# making it run

1. you'll need a php host to host `distancematrix.php`
2. you'll need to enter your own direction matrix api key in `config.json`
3. please also edit the google maps api in `index.html` (`key=AIzaSyCEQ1T-D7ojKNqDtm6Nop_nvScIn-CofG8`) to one you request yourself.

This is also configured to be able to be deployed on [heroku](heroku.com), where you can put the api key as an environment variable.

You can get the Google distance matrix api key here [](https://developers.google.com/maps/documentation/distance-matrix/intro).

The site is built to run with Jekyll, but you can also copy the output to any php/html host.

# License

[![Creative Commons Licence](https://i.creativecommons.org/l/by/4.0/88x31.png)](http://creativecommons.org/licenses/by/4.0/)

Maps Checker is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/). No warranty whatsoever.

# Making use of

Haroen Viaene's [notice](https://github.com/haroenv/notice) [![Creative Commons Licence](https://i.creativecommons.org/l/by/4.0/88x31.png)](http://creativecommons.org/licenses/by/4.0/).

Haroen Viaene's [modal](https://github.com/haroenv/modal) [![Creative Commons Licence](https://i.creativecommons.org/l/by/4.0/88x31.png)](http://creativecommons.org/licenses/by/4.0/).


[Chart.js](http://www.chartjs.org/) by @nnnick (MIT)

[Chart.Scatter](https://github.com/dima117/Chart.Scatter) by @dima117 (MIT)

# Source

The source code is visible on [github.com/haroenv/maps-checker](https://github.com/haroenv/maps-checker). You can clone this using git:

`git clone https://github.com/Haroenv/maps-checker.git`

Or using wget:

`wget https://github.com/Haroenv/maps-checker/archive/gh-pages.zip`
