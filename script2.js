$('document').ready(function() {
	$('#search').on('click', function(event) {
		event.preventDefault();
		// addData();
		// addData();

		var history = [];
		var city = $('#cityData').val();

		// var cityButton = JSON.parse(localStorage.getItem("cityID"));
		// var city = localStorage.getItem('last search');

		function addData() {
			$.ajax({
				url:
					'HTTPS://api.openweathermap.org/data/2.5/weather?q=' +
					city +
					'&appid=a66005cdeed278c7401c80000cda18a8',
				method: 'GET'
			}).then(
				///////////<<<<--------------1
				function(response) {
					// console.log("response");
					// addData();
					$('#card-body').empty();
					$('.card-header').empty();

					// This div will be for the data being returned
					var weatherDiv = $("<div class='weather'>");

					// This will get the temp data and add to html

					var temP = response.main.temp;
					var hOne = $('<h6>').text('Temperature: ' + Math.floor(9 / 5 * temP - 459.67) + '°F');
					weatherDiv.append(hOne);

					// this will get the humidity
					var humD = response.main.humidity;
					var hTwo = $('<h6>').text('Humidity: ' + humD + '  %');
					weatherDiv.append(hTwo);

					// This will get the Wind speed
					var windS = response.wind.speed;
					var hThree = $('<h6>').text('Wind Speed: ' + windS + '   MPH');
					weatherDiv.append(hThree);

					// This will get the UV index
					var uvIndex = response;
					var hFour = $('<h6>').text('UV Index: ' + uvIndex);
					weatherDiv.append(hFour);

					var icon = response.weather[0].icon;

					var iconU = 'http://openweathermap.org/img/w/' + icon + '.png';
					var url = $("<img src='" + iconU + "'></img>");

					$('.card-header').append('<h2>' + city + '(' + setDate() + ') </h2>');
					$('.card-header').append(url);
					$('#card-body').prepend(weatherDiv);

					$('#add-movie').on('click', function(event) {
						// This line grabs the input from the textbox
						var cityName = $('#cityData').val().trim();

						// Adding movie from the textbox to our array
						history.push(cityName);
						$('.list-group').append('<li>' + history);
					});

					// console.log(response)
				}
			);
		}

		// This will be for the 5 day forecast
		function fiveDay() {
			$.ajax({
				url:
					'HTTPS://api.openweathermap.org/data/2.5/forecast?q=' +
					city +
					'&appid=a66005cdeed278c7401c80000cda18a8',
				method: 'GET'
			}).then(function(response) {
				$('.forecast').empty();
				var newRow = $("<div class='row'></div>");
				$('#forecast').append(newRow);

				for (var i = 0; i < response.list.length; i++) {
					// console.log(response.list.length);
					if (response.list[i].dt_txt.indexOf('15:00:00') !== -1) {
						// console.log(list[i])

						var titleOne = $('<h6>').addClass('card-title').text(new Date(response.list[i].dt_txt));
						var iconOne = $('<img>').attr(
							'src',
							'https://openweathermap.org/img/w/' + response.list[i].weather[0].icon + '.png'
						);
						var colOne = $('<div>').addClass('col-md-4');
						var cardOne = $('<div>').addClass('card bg-primary text-white');
						var cardBodyOne = $('<div>').addClass('card-body p-2');
						var humidOne = $('<p>')
							.addClass('card-text')
							.text('Humidity: ' + response.list[i].main.humidity + '%');
						var tempOne = $('<p>')
							.addClass('card-text')
							.text('Temperature: ' + response.list[i].main.temp + ' °F');

						colOne.append(cardOne.append(cardBodyOne.append(titleOne, iconOne, tempOne, humidOne)));
						$('#forecast .row').append(colOne);
						console.log(colOne);
					}
				}
			});
		}

		addData();
		fiveDay();

		function setDate() {
			var date = moment().format('l');
			return date;
		}
	});
});
