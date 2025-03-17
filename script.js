const apiKey = window.env.API_KEY

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

/* To add:
1. Need to add error handling and best practices to this block
2. Hide Dom content before search occurs
3. ignore capitalization of text in input
4. Add dropdown list of all cities with the name typed?
*/

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("searchButton").addEventListener("click", async function() {
        const searchInput = document.getElementById("cityInput").value
        const cityId = await fetchCityId(searchInput)
        const weatherObject = await fetchWeather(cityId)
        console.log(weatherObject)
        document.getElementById('temperature').innerHTML = `${Math.round(weatherObject.list[0].main.temp - 273.15)}°C`
        document.getElementById('weather-description').innerHTML = weatherObject.list[0].weather[0].description
        document.getElementById('feels-like').innerHTML = `${Math.round(weatherObject.list[0].main.feels_like - 273.15)}°C`
        document.getElementById('humidity').innerHTML = `${Math.round(weatherObject.list[0].main.humidity)}%`
        document.getElementById('wind-speed').innerHTML = `${Math.round(weatherObject.list[0].wind.speed)} mph`
    })
})