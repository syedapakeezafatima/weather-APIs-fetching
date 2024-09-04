document.addEventListener('DOMContentLoaded', function () {
    const savedCity = localStorage.getItem('city');
    if (savedCity) {
        document.getElementById('city-input').value = savedCity;
        fetchWeatherData(savedCity);
    }

    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        const city = document.getElementById('city-input').value;
        localStorage.setItem('city', city); // Save the city to localStorage
        fetchWeatherData(city);
    });
});

function fetchWeatherData(city) {
    const apiKey = 'fde601f92916b5d76db040ab7f518d00';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.main) {
                updateWeatherData(data);
                updateGreeting();
                fetchWeeklyForecast(city, apiKey);
            } else {
                alert('City not found or data incomplete!');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again later.');
        });
}

function fetchWeeklyForecast(city, apiKey) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.list) {
                const dailyForecast = processDailyForecast(data.list);
                updateWeeklyForecast(dailyForecast);
            } else {
                alert('Weekly forecast data not available!');
            }
        })
        .catch(error => {
            console.error('Error fetching weekly forecast data:', error);
            alert('Failed to fetch weekly forecast data. Please try again later.');
        });
}

function processDailyForecast(forecastList) {
    const dailyForecast = {};

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!dailyForecast[day]) {
            dailyForecast[day] = {
                temp: item.main.temp,
                description: item.weather[0].description,
                count: 1
            };
        } else {
            dailyForecast[day].temp += item.main.temp;
            dailyForecast[day].count += 1;
        }
    });

    Object.keys(dailyForecast).forEach(day => {
        dailyForecast[day].temp = Math.round(dailyForecast[day].temp / dailyForecast[day].count);
    });

    return dailyForecast;
}

function updateWeeklyForecast(dailyForecast) {
    const forecastContainer = document.querySelector('.weekly-forecast');
    forecastContainer.innerHTML = '';

    Object.keys(dailyForecast).forEach(day => {
        const forecastItem = `
            <div class="forecast-item">
                <h3>${day}</h3>
                <p>${dailyForecast[day].temp}&deg;C</p>
                <p>${dailyForecast[day].description}</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastItem;
    });
}

function updateWeatherData(data) {
    const current = data.main;
    const weather = data.weather[0];
    document.querySelector('.location-date h2').textContent = data.name || 'No Address';
    document.querySelector('.temperature h1').innerHTML = `${Math.round(current.temp)}&deg;C` || 'No Temp';
    document.querySelector('.temperature p').textContent = weather.description || 'No Conditions';
    document.querySelector('.details').innerHTML = `
        <p>Wind: ${data.wind.speed || 'No Windspeed'} m/s</p> 
        <p>Humidity: ${current.humidity || 'No Humidity'}%</p>
        <p>Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
    `;
}

function updateGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const greetingElement = document.querySelector('.greeting p:first-of-type');
    const timeElement = document.querySelector('.greeting p:nth-of-type(2)');

    if (hours >= 5 && hours < 12) {
        greetingElement.textContent = 'Good Morning';
    } else if (hours >= 12 && hours < 17) {
        greetingElement.textContent = 'Good Afternoon';
    } else if (hours >= 17 && hours < 21) {
        greetingElement.textContent = 'Good Evening';
    } else {
        greetingElement.textContent = 'Good Night';
    }

    timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
