document.addEventListener('DOMContentLoaded', function () {
    const savedCity = localStorage.getItem('city');
    if (savedCity) {
        document.getElementById('city-input').value = savedCity;
        fetchWeatherData(savedCity);
    }

    document.getElementById('search-form').addEventListener('submit', function (event) {
        event.preventDefault(); 
        const city = document.getElementById('city-input').value;

        // ye local city ma save kr ly ga 

        localStorage.setItem('city', city); 
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
                updateGreeting(data.timezone); 
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

    // yehn ek emply object creat kia ha 

    const dailyForecast = {}; 

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        // const date = new Date(item.dt * 1000);  converts this Unix timestamp into a JavaScript Date object. The multiplication by 1000 is necessary because JavaScript's Date constructor expects milliseconds, not seconds
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });

        
        if (!dailyForecast[day]) {
            dailyForecast[day] = {
                temp: item.main.temp,
                description: item.weather[0].description,
            };
        }
    });

    return dailyForecast;
}

function updateWeeklyForecast(dailyForecast) {
    const forecastContainer = document.getElementById('weekly-forecast');
    forecastContainer.innerHTML = ''; 
    // Clear previous content

    Object.keys(dailyForecast).forEach(day => {
        const forecastItem = `
            <div class="forecast-item">
                <h3>${day}</h3>
                <p>${dailyForecast[day].temp.toFixed(1)}&deg;C</p>
                <p>${dailyForecast[day].description}</p>
            </div>
        `;
        forecastContainer.innerHTML += forecastItem;
    });
}

function updateWeatherData(data) {
    const current = data.main;
    const weather = data.weather[0];

    document.getElementById('city-name').textContent = data.name || 'No Address';
    document.getElementById('temp').innerHTML = `${Math.round(current.temp)}&deg;` || 'No Temp';
    document.getElementById('weather-desc').textContent = weather.description || 'No Conditions';
    document.getElementById('wind-speed').textContent = `${data.wind.speed} mph` || 'No Windspeed';
    document.getElementById('humidity').textContent = `${current.humidity}%` || 'No Humidity';

    // Update side section details
    document.getElementById('side-temp').innerHTML = `${Math.round(current.temp)}&deg;` || 'No Temp';
    document.getElementById('side-wind').textContent = `${data.wind.speed} mph` || 'No Windspeed';
    document.getElementById('side-humidity').textContent = `${current.humidity}%` || 'No Humidity';
    document.getElementById('feels-like').textContent = `${Math.round(current.feels_like)}&deg;` || 'No Feels Like Temp';
    
    // Update date
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function updateGreeting(timezoneOffset) {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; 
    const localTime = new Date(utcTime + timezoneOffset * 1000); 

    const hours = localTime.getUTCHours(); 
    const greetingElement = document.getElementById('greeting-message');
    const timeElement = document.getElementById('current-time');

    if (hours >= 5 && hours < 12) {
        greetingElement.textContent = 'Good Morning';
    } else if (hours >= 12 && hours < 17) {
        greetingElement.textContent = 'Good Afternoon';
    } else if (hours >= 17 && hours < 21) {
        greetingElement.textContent = 'Good Evening';
    } else {
        greetingElement.textContent = 'Good Night';
    }

    timeElement.textContent = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    }).format(localTime);
}
function updateGreeting(timezoneOffset) {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + timezoneOffset * 1000); 

    const hours = localTime.getHours(); // Get local time hours

    const greetingElement = document.getElementById('greeting-message');
    const timeElement = document.getElementById('current-time');

   
    if (hours >= 5 && hours < 12) {
        greetingElement.textContent = 'Good Morning';
    } else if (hours >= 12 && hours < 17) {
        greetingElement.textContent = 'Good Afternoon';
    } else if (hours >= 17 && hours < 21) {
        greetingElement.textContent = 'Good Evening';
    } else {
        greetingElement.textContent = 'Good Night';
    }

 
    timeElement.textContent = localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

