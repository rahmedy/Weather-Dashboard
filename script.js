$('document').ready(function () {
    $('#search').on('click', function (event) {
        event.preventDefault();

        var history = [];
        var city = $('#cityData').val();

        $.ajax({
            url:
                'HTTPS://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=a66005cdeed278c7401c80000cda18a8',
            method: 'GET'
        }).then(function (response) {
            console.log(response);
            addData();
            fiveDay();
            // renderButtons(); 

            function addData() {
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

                $('#add-movie').on('click', function (event) {
                    // This line grabs the input from the textbox
                    var cityName = $('#cityData').val().trim();

                    // Adding movie from the textbox to our array
                    history.push(cityName);
                    $('.list-group').append('<li>' + history);
                });
            }

            // This will be for the 5 day forecast 
            function fiveDay() {


                $.ajax({
                    url:'HTTPS://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=a66005cdeed278c7401c80000cda18a8',
                    method: 'GET'
                }).then(function (response) {
                    // $(".forecast").html("<h4 class = \ "mt-3\"> 5 day forecast: </h4>")


                   



                })
            }

            function renderButtons() {
               
                // Looping through the array of citites 
                for (var i = 0; i < history.length; i++) {

                    // Then dynamicaly generating buttons for each city in the array
                    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
                    var a = $('<button>');

                    // Adding a class of history-btn to our button
                    a.addClass('history-btn');

                    // Adding a data-attribute
                    a.attr('data-name', history[i]);

                    // Providing the initial button text
                    a.text(history[i]);

                    // Adding the button to the buttons-view div
                    $('.list-group').append(a);
                }
            }
        });
    });
    function setDate() {
        var date = moment().format('l');
        return date;
    }
});

$(document).on('click', '#search', addData);
renderButtons();
