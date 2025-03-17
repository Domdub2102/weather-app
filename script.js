const apiKey = window.env.API_KEY

document.addEventListener("DOMContentLoaded", function() {

    const imageElement = document.getElementById('weather-icon')
    const tempElement = document.getElementById('temperature')
    const descElement = document.getElementById('weather-description')
    const feelsLikeElement = document.getElementById('feels-like')
    const humidityElement = document.getElementById('humidity')
    const windSpeedElement = document.getElementById('wind-speed')
    const results = document.getElementById('results')

    document.getElementById("searchButton").addEventListener("click", async function() {

        const searchInput = capitalizeFirstLetter(document.getElementById("cityInput").value)
        if (!searchInput) {
            console.error("Please enter a City")
            return
        }

        const cityId = await fetchCityId(searchInput)
        if (!cityId) {
            console.error("No City found with that name. Please try again")
            return
        }

        const weatherObject = await fetchWeather(cityId)
        if (!weatherObject || !weatherObject.list || weatherObject.list.length === 0) {
            console.error("Invalid weather data");
            return;
        }

        const temp = Math.round(weatherObject.list[0].main.temp - 273.15)
        const description = weatherObject.list[0].weather[0].description
        const feelsLike = Math.round(weatherObject.list[0].main.feels_like - 273.15)
        const humidity = Math.round(weatherObject.list[0].main.humidity)
        const windSpeed = Math.round(weatherObject.list[0].wind.speed)
        
        results.style.display = "block"
        tempElement.innerHTML = `${temp}°C`
        descElement.innerHTML = description
        feelsLikeElement.innerHTML = `${feelsLike}°C`
        humidityElement.innerHTML = `${humidity}%`
        windSpeedElement.innerHTML = `${windSpeed} mph`

        if (description.includes('cloud')) {
            imageElement.src = "./icons/cloud-icon.png"
        } 
        if (description.includes('clear')) {
            imageElement.src = "./icons/sun-icon.png"
        }
        if (description.includes('rain')) {
            imageElement.src = "./icons/raincloud-icon.png"
        }
    })
})

// fetches the cities array from city.list.json,
// and finds the id of the user's city 
async function fetchCityId(cityName) {
    try {
        const response = await fetch("./city.list.json")
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
        const data = await response.json()
        const city = data.find(city => city.name === cityName)
        if (!city) {
            throw new Error("No city with that name")
        }
        else {
            return city.id
        }
    } 
    catch (error) {
        console.log("Error fetching cities: ", error)
        return null
    }
}

// fetches weather using OpenWeather API
async function fetchWeather(cityId) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch weather: ${response.statusText}`)
        }
        data = response.json()
        return data
    } 
    catch (error) {
        console.log(error)
        return {}
    }
}

function capitalizeFirstLetter(string) {
    return string
        .split(' ')
        .map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ')
}