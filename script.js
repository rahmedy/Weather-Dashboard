$('document').ready(function () {
    $('#search').on('click', function (event) {
        event.preventDefault();
        addData(city);
        fiveDay(city);

        var city = $('#cityData').val();
        var historyList = JSON.parse(localStorage.getItem('history')) || [];

        historyList.push(city);
        localStorage.setItem('history', JSON.stringify(historyList));
        var weatherDiv = $("<div class='weather'>");

        function addData(city) {
            $.ajax({
                url: 'HTTPS://api.openweathermap.org/data/2.5/weather?q=' +
                    city +
                    '&appid=a66005cdeed278c7401c80000cda18a8',
                method: 'GET'
            }).then(function (response) {
                $('#card-body').empty();
                $('.card-header').empty();
                // This will get the temp data and add to html

                var temP = response.main.temp;
                var hOne = $('<h6>').text('Temperature: ' + Math.floor(9 / 5 * temP - 459.67) + '°F');
                weatherDiv.append(hOne);

                // This will get the humidity
                var humD = response.main.humidity;
                var hTwo = $('<h6>').text('Humidity: ' + humD + '  %');
                weatherDiv.append(hTwo);

                // This will get the Wind speed
                var windS = response.wind.speed;
                var hThree = $('<h6>').text('Wind Speed: ' + windS + '   MPH');
                weatherDiv.append(hThree);

                // This will add to  the UV index
                var icon = response.weather[0].icon;
                var iconU = 'http://openweathermap.org/img/w/' + icon + '.png';
                var url = $("<img src='" + iconU + "'></img>");
                $('.card-header').append('<h2>' + city + '(' + setDate() + ') </h2>');
                $('.card-header').append(url);
                $('#card-body').prepend(weatherDiv);

                uvIndex(response.coord.lat, response.coord.lon);
            });
        }

        // funnction to actullay get the UV index
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
            }).then(function (response) {
                var uvResponse = response.value;
                console.log(response);
                // var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);
                var uvIndex = $('<p>').text('UV Index: ');
                var uvSpan = $('<span>').text(uvResponse);

                if (uvResponse < 2) {
                    uvSpan.css('background-color', 'green');
                } else if (uvResponse < 6) {
                    uvSpan.css('background-color', 'yellow');
                } else {
                    uvSpan.css('background-color', 'red');
                }
                uvIndex.append(uvSpan);
                weatherDiv.append(uvIndex);
                $('#card-body').prepend(weatherDiv);
            });
        }

        // This will be for the 5 day forecast
        function fiveDay(city) {
            $.ajax({
                url: 'HTTPS://api.openweathermap.org/data/2.5/forecast?q=' +
                    city +
                    '&appid=a66005cdeed278c7401c80000cda18a8',
                method: 'GET'
            }).then(function (response) {
                $('#fiveDay').empty();
                var newRow = $("<div class='row'></div>").css('float', 'left');
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
                        var colOne = $('<div>').addClass('col-md-4').css('float', 'left');
                        var cardOne = $('<div>').addClass('card bg-primary text-white ');
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

        var historyList = JSON.parse(localStorage.getItem('history'));
        // console.log('historyList', historyList);
        if (historyList.length !== 0) {
            addData(historyList[historyList.length - 1]);
            fiveDay(historyList[historyList.length - 1]);
        }
        console.log(historyList);
        for (var i = 0; i < historyList.length; i++) {
            var listCity = $('<li>').text(historyList[i]);
            $('#list').append(listCity);
        }
    });

    // localStorage.removeItem('history')
});