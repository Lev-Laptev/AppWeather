document.addEventListener('DOMContentLoaded', () => {
    const iconElement = document.querySelector(".weather__icon");
    const tempElement = document.querySelector(".weather__temperature p");
    const descElement = document.querySelector(".weather__description p");
    const locationElement = document.querySelector(".weather__location p");
    const notificationElement = document.querySelector(".weather__notification");
    
    const weather = {};
    
    weather.temperature = {
        unit: "celsius"
    }
    
    const KELVIN = 273;
    
    const KEY = "6fc789e35e773f3230b62b6c78855f56";
    
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser does not support geolocation</p>";
    }
    
    function setPosition(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
    
        getWeather(latitude, longitude);
    }
    
    function showError() {
        notificationElement.style.display = "block";
        notificationElement.innerHTML = `<p>User refused to geolocate</p>`;
    }
    
    function getWeather(latitude, longitude) {
        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}&lang=en`;
    
        fetch(api)
            .then(function(response) {
                let data = response.json();
                return data;
            })
            .then(function(data) {
                weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
            })
            .then(function() {
                displayWeather();
            });
    }
    
    function displayWeather() {
        iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" alt="weather-icon"/>`;
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descElement.innerHTML = weather.description;
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    }
    
    function celsiusToFahrenheit(temperature) {
        return (temperature * 9 / 5) + 32;
    }
    
    tempElement.addEventListener("click", function() {
        if (weather.temperature.value === undefined) return;
    
        if (weather.temperature.unit == "celsius") {
            let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
            fahrenheit = Math.floor(fahrenheit);
    
            tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
            weather.temperature.unit = "fahrenheit";
        } else {
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            weather.temperature.unit = "celsius"
        }
    });
});