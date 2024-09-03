document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    const apiKey = 'fde601f92916b5d76db040ab7f518d00';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
// data fetch krny k bd json ma convert krna ha 
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeatherData(data);
            } else {
                alert('City not found!');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
});

// yehn sa update ho ga data

function updateWeatherData(data) {
    document.querySelector('.location-date h2').textContent = data.name;
    document.querySelector('.temperature h1').innerHTML = `${Math.round(data.main.temp)}&deg;`;
    document.querySelector('.temperature p').textContent = data.weather[0].description;
    document.querySelector('.details').innerHTML = `
        <p>${data.wind.speed} mph</p>
        <p>${data.main.humidity}%</p>
    `;
}





// catch will handel error 