var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
require('dotenv').config({ path: './config.env' })

// default city
let city = 'Kanpur';
app.use(bodyParser.json());


// rendering home page 

app.get('/', function (req, res) {
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.WEATHER_ID}`;

    request(url, function (error, respone, body) {
        var weather_json = JSON.parse(body);
        //=============
        var dateTime = new Date();
        var hrs = dateTime.getHours();
        var min = dateTime.getMinutes();
        var sec = dateTime.getSeconds();
        var session = "";

        if (hrs >= 12) {
            session = "PM";
        } else {
            session = "AM";
        }

        if (hrs > 12) {
            hrs = hrs - 12;
        }
        //===================
        //! this part of code use to print today's date month and week
        var options = {
            weekday: "long", //* long means in word
            day: "numeric",
            month: "long"
        };
        var calander = dateTime.toLocaleDateString("en-US", options);

        // console.log(weather_json);

        var data = {
            city: city,
            temp: Math.round(weather_json.main.temp),
            icon: weather_json.weather[0].icon,
            des: weather_json.weather[0].description,
            humi: weather_json.main.humidity,
            country: weather_json.sys.country,
            wind: weather_json.wind.speed,
            temp_max: weather_json.main.temp_max,
            pressure: weather_json.main.pressure,
            date: calander,
            hrs: hrs,
            min: min,
            sec: sec,
            session: session,

        }
        var data = { data: data }
        res.render('weather.ejs', data);
    });

});

// post request from search input from weather.ejs 

app.post('/weather', (req, res) => {
    var city = req.body.city2;
    res.redirect('/weather2/' + city);
})


// post request from the celsius page 
app.post('/weather2', (req, res) => {
    var city = req.body.city;
    res.redirect('/weather2/' + city);
})


// finding data of the searched 

app.get('/weather2/:city', function (req, res) {
    var city = req.params.city;

    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.WEATHER_ID}`;

    request(url, function (error, respone, body) {
        var weather_json = JSON.parse(body);
        //console.log(weather_json);



        if (!weather_json.message) {
            var dateTime = new Date();
            var hrs = dateTime.getHours();
            var min = dateTime.getMinutes();
            var sec = dateTime.getSeconds();
            var session = "";

            if (hrs >= 12) {
                session = "PM";
            } else {
                session = "AM";
            }

            if (hrs > 12) {
                hrs = hrs - 12;
            }
            //! this part of code use to print today's date month and week
            var options = {
                weekday: "long", //* long means in word
                day: "numeric",
                month: "long"
            };
            var calander = dateTime.toLocaleDateString("en-US", options);
            var cel = ((Math.round(weather_json.main.temp) - 32) * 5) / 9;

            var data = {
                city: city,
                temp: Math.round(weather_json.main.temp),
                icon: weather_json.weather[0].icon,
                des: weather_json.weather[0].description,
                humi: weather_json.main.humidity,
                country: weather_json.sys.country,
                wind: weather_json.wind.speed,
                temp_max: weather_json.main.temp_max,
                pressure: weather_json.main.pressure,
                date: calander,
                hrs: hrs,
                min: min,
                sec: sec,
                session: session,

            }
            var data = { data: data }
            res.render('weather.ejs', data);
        } else {

            res.render('weather.ejs', { data: "city not found" });
        }


    });

});

// taking city name to convert into celsius

app.post('/cel', function (req, res) {
    var city = req.body.city;

    res.redirect('/cel/' + city)

});

// converting to celsius
app.get('/cel/:city', function (req, res) {
    var city = req.params.city;
    //console.log(city);
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.WEATHER_ID}`;

    request(url, function (error, respone, body) {
        var weather_json = JSON.parse(body);
        //console.log(weather_json);




        if (!weather_json.message) {
            var dateTime = new Date();
            var hrs = dateTime.getHours();
            var min = dateTime.getMinutes();
            var sec = dateTime.getSeconds();
            var session = "";

            if (hrs >= 12) {
                session = "PM";
            } else {
                session = "AM";
            }

            if (hrs > 12) {
                hrs = hrs - 12;
            }
            //! this part of code use to print today's date month and week
            var options = {
                weekday: "long", //* long means in word
                day: "numeric",
                month: "long"
            };
            var calander = dateTime.toLocaleDateString("en-US", options);
            var cel = ((Math.round(weather_json.main.temp) - 32) * 5) / 9;
            var max = ((Math.round(weather_json.main.temp_max) - 32) * 5) / 9;
            var km = ((weather_json.wind.speed) * 1.6093440)
            var kmp = km.toFixed(3);

            var data = {
                city: city,
                temp: Math.round(weather_json.main.temp),
                icon: weather_json.weather[0].icon,
                des: weather_json.weather[0].description,
                humi: weather_json.main.humidity,
                country: weather_json.sys.country,
                wind: weather_json.wind.speed,
                temp_max: weather_json.main.temp_max,
                pressure: weather_json.main.pressure,
                date: calander,
                hrs: hrs,
                min: min,
                sec: sec,
                session: session,
                cel: "yes"

            }
            var data = { data: data }
            res.render('weather.ejs', data);
        } else {
            res.render('weather.ejs', { data: "city not found" });

        }


    });

});


// port to run 
app.listen(process.env.PORT);

