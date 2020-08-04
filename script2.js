$('document').ready(function() {
	$('#search').on('click', function(event) {
		event.preventDefault();
		

		var city = $('#cityData').val();
		var historyList = JSON.parse(localStorage.getItem('history')) || [];
		// console.log('historyList1', historyList)
		historyList.push(city);
		// console.log('historyList2', historyList)
		localStorage.setItem('history', JSON.stringify(historyList));
		// historyList = {
		// 	'history': 'new york'
		// }
		// historyList = {
		// 	'history': 'Brooklyn center'
		// }
		var weatherDiv = $("<div class='weather'>");
		// var cityButton = JSON.parse(localStorage.getItem("cityID"));
		// var city = localStorage.getItem('last search');
		function addData(city) {
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
					$('#card-body').empty();
					$('.card-header').empty();

					// This div will be for the data being returned
					// var weatherDiv = $("<div class='weather'>");
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
		
					
					var icon = response.weather[0].icon;
					var iconU = 'http://openweathermap.org/img/w/' + icon + '.png';
					var url = $("<img src='" + iconU + "'></img>");
					$('.card-header').append('<h2>' + city + '(' + setDate() + ') </h2>');
					$('.card-header').append(url);
					$('#card-body').prepend(weatherDiv);
				
					uvIndex(response.coord.lat, response.coord.lon);
					// console.log(response)
				}
			);
		}
		function uvIndex(lat = 0, lon = 0) {
			const url =
				'https://api.openweathermap.org/data/2.5/uvi?&lat=' +
				lat +
				'&lon=' +
				lon +
				'&appid=a66005cdeed278c7401c80000cda18a8';
			$.ajax({
				url: url,
				method: 'GET'
			}).then(function(response) {
				var uvResponse = response.value;
				console.log(response);
				// var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);
				var uvIndex = $('<p>').text('UV Index: ');
				var uvSpan = $('<span>').text(uvResponse);
				// uvSpan.removeClass('red green purple');
				if (uvResponse < 2) {
					uvSpan.css('color', 'green');
				} else if (uvResponse < 6) {
					uvSpan.css('color', 'yellow');
				} else {
					uvSpan.css('color', 'red');
				}
				uvIndex.append(uvSpan);
				weatherDiv.append(uvIndex);
				$('#card-body').prepend(weatherDiv);
				// console.log(response);
			});
			// console.log(response);
		}

		// This will be for the 5 day forecast
		function fiveDay(city) {
			$.ajax({
				url:
					'HTTPS://api.openweathermap.org/data/2.5/forecast?q=' +
					city +
					'&appid=a66005cdeed278c7401c80000cda18a8',
				method: 'GET'
			}).then(function(response) {
				$('#fiveDay').empty();
				var newRow = $("<div class='row'></div>");
				$('#fiveDay').append(newRow);
				for (var i = 0; i < response.list.length; i++) {
					// console.log(response.list.length);
					if (response.list[i].dt_txt.indexOf('15:00:00') !== -1) {
						// console.log(list[i])
						var titleOne = $('<h6>').addClass('card-title').text(new Date(response.list[i].dt_txt));
						var iconOne = $('<img>').attr(
							'src',
							'https://openweathermap.org/img/w/' + response.list[i].weather[0].icon + '.png'
						);
						var colOne = $('<div>').addClass('col-md-3');
						var cardOne = $('<div>').addClass('card bg-primary text-white');
						var cardBodyOne = $('<div>').addClass('card-body p-2');
						var humidOne = $('<p>')
							.addClass('card-text')
							.text('Humidity: ' + response.list[i].main.humidity + '%');

					
						var tempOne = $('<p>')
							.addClass('card-text')
							.text('Temperature: ' + Math.floor(9 / 5 * response.list[i].main.temp - 459.67) + '°F');
						colOne.append(cardOne.append(cardBodyOne.append(titleOne, iconOne, tempOne, humidOne)));
						$('#fiveDay .row').append(colOne);
						
					}
				}
			});
		}
	
		function setDate() {
			var date = moment().format('l');
			return date;
		}

		addData(city);
		fiveDay(city);
	});

	var historyList = JSON.parse(localStorage.getItem('history'));
	console.log('historyList', historyList);
	if (historyList.length !== 0) {
		addData(historyList[historyList.length - 1]);
		fiveDay(historyList[historyList.length - 1]);
	}
	for (var i = 0; i < historyList.length; i++) {
		var listCity = $('<p>').text(historyList[i]);
		$('#list').append(listCity);
	}
});
// localStorage.removeItem('history')
