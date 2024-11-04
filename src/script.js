window.addEventListener("DOMContentLoaded", main)

function main() {
    getWeatherToday()

    async function getWeatherToday() {
        const response = await fetch("http://127.0.0.1:5000/getWeatherToday")
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`
            throw new Error(message)
        }

        const data = await response.json()
        console.table(data.forecast.forecastday[0].hour)
    }

    async function getWeatherWeek() {
        const response = await fetch("http://127.0.0.1:5000/getWeatherWeek")
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`
            throw new Error(message)
        }

        const data = await response.json()
        console.table(data.forecast.forecastday[0].hour)
    }

}