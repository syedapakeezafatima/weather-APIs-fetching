document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    const city = document.getElementById('city-input').value;
    const apiKey = 'fde601f92916b5d76db040ab7f518d00';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`; // Corrected URL with city parameter
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            if (data && data.main) { // Check if data contains the weather information
                updateWeatherData(data);
                updateGreeting();
            } else {
                alert('City not found or data incomplete!');
                console.error('Data issue:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again later.');
        });
});

function updateWeatherData(data) {
    // OpenWeatherMap API uses 'main' for temperature data
    const current = data.main;
    const weather = data.weather[0]; // Access the weather conditions array
    document.querySelector('.location-date h2').textContent = data.name || 'No Address';
    document.querySelector('.temperature h1').innerHTML = `${Math.round(current.temp)}&deg;` || 'No Temp';
    document.querySelector('.temperature p').textContent = weather.description || 'No Conditions';
    document.querySelector('.details').innerHTML = `
        <p>Wind: ${data.wind.speed || 'No Windspeed'} mph</p>
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
