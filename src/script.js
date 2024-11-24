window.addEventListener("DOMContentLoaded", main)

function main() {
    let listOfWeatherOfHours = []
    const now = new Date()
    const hour = now.getHours()
    let actualHourSeen = hour
    const weatherEmojis = {
        1000: { 1: "☀️", 0: "🌕" },         // Clear
        1003: { 1: "🌤️", 0: "☁️" },       // Partly Cloudy
        1006: { 1: "🌥️", 0: "☁️" },       // Cloudy
        1009: { 1: "☁️", 0: "☁️" },        // Overcast
        1030: { 1: "🌫️", 0: "🌫️" },       // Mist
        1135: { 1: "🌫️", 0: "🌫️" },       // Fog
        1147: { 1: "🌫️", 0: "🌫️" },       // Freezing Fog
        1063: { 1: "🌦️", 0: "🌧️" },       // Patchy Rain Possible
        1150: { 1: "🌧️", 0: "🌧️" },       // Light Drizzle
        1153: { 1: "🌧️", 0: "🌧️" },       // Patchy Light Drizzle
        1180: { 1: "🌦️", 0: "🌧️" },       // Light Rain Shower
        1183: { 1: "🌧️", 0: "🌧️" },       // Light Rain
        1186: { 1: "🌧️", 0: "🌧️" },       // Moderate Rain at Times
        1189: { 1: "🌧️", 0: "🌧️" },       // Moderate Rain
        1192: { 1: "🌧️", 0: "🌧️" },       // Heavy Rain at Times
        1195: { 1: "🌧️", 0: "🌧️" },       // Heavy Rain
        1240: { 1: "🌦️", 0: "🌧️" },       // Light Rain Shower
        1243: { 1: "🌧️", 0: "🌧️" },       // Moderate or Heavy Rain Shower
        1246: { 1: "🌧️", 0: "🌧️" },       // Torrential Rain Shower
        1273: { 1: "⛈️", 0: "⛈️" },       // Patchy Light Rain with Thunder
        1276: { 1: "⛈️", 0: "⛈️" },       // Moderate or Heavy Rain with Thunder
        1279: { 1: "🌨️⛈️", 0: "🌨️⛈️" }, // Patchy Light Snow with Thunder
        1282: { 1: "🌨️⛈️", 0: "🌨️⛈️" }, // Moderate or Heavy Snow with Thunder
        1066: { 1: "🌨️", 0: "🌨️" },       // Patchy Snow Possible
        1210: { 1: "🌨️", 0: "🌨️" },       // Light Snow
        1213: { 1: "🌨️", 0: "🌨️" },       // Patchy Light Snow
        1216: { 1: "🌨️", 0: "🌨️" },       // Moderate Snow
        1219: { 1: "🌨️", 0: "🌨️" },       // Patchy Moderate Snow
        1222: { 1: "🌨️", 0: "🌨️" },       // Heavy Snow
        1225: { 1: "🌨️💨", 0: "🌨️💨" },   // Blowing Snow
        1114: { 1: "🌨️💨", 0: "🌨️💨" },   // Blizzard
        1237: { 1: "🌨️", 0: "🌨️" },       // Ice Pellets
        1261: { 1: "🌧️", 0: "🌧️" },       // Light Freezing Rain
        1264: { 1: "🌧️", 0: "🌧️" }        // Heavy Freezing Rain
    }
    const resetHourButton = document.getElementById("resetHourButton")
    resetHourButton.addEventListener("click", resetHour)

    getWeatherToday()
    loadHour()


    async function getWeatherToday() {
        if (listOfWeatherOfHours.length != 0) {
            return
        }

        const response = await fetch("http://127.0.0.1:5000/getWeatherToday")
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`
            throw new Error(message)
        }

        const listOfHours = document.getElementById("listOfHours")
        const data = await response.json()
        let dataListOfHours = data.forecast.forecastday[0].hour

        dataListOfHours.forEach((element, index) => {
            const { humidity, wind_kph, is_day, temp_c, uv, vis_km, chance_of_rain, cloud, condition } = element
            const { code } = condition
            const actualHour = listOfHours.children[index]

            actualHour.querySelector(".timeWeatherTemperature").innerHTML = parseInt(temp_c) + "º"
            actualHour.querySelector(".timeWeatherIcon").innerHTML = getWeatherEmoji(code, is_day)

            if (hour == index + 1) {
                document.getElementById("weatherIcon").innerHTML = getWeatherEmoji(code, is_day)
                document.getElementById("temperature").innerText = parseInt(temp_c) + "ºC"
            }

            listOfWeatherOfHours.push({ humidity, wind_kph, uv, vis_km, chance_of_rain, cloud })
        })
        loadActualWeather()

        Array.from(listOfHours.children).forEach((element, index) => {
            element.addEventListener("click", () => {

                if (hour == index + 1) {
                    resetHourButton.classList.add("hidden")
                } else {
                    resetHourButton.classList.remove("hidden")
                }

                actualHourSeen = index + 1
                loadActualWeather()
            })
        })
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

    function loadHour() {
        const dayElement = document.getElementById("day")
        const timeElement = document.getElementById("time")

        const actualHour = document.getElementById("actualHour")
        const listOfHours = document.getElementById("listOfHours")

        actualHour.innerHTML = hour + ":00"

        centerHourScroll(hour)

        // Cambiar el texto del dia y la hora
        const dayName = getDayName(now, 'es-ES')
        dayElement.innerHTML = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        timeElement.innerHTML = hour + ":00"
    }

    function getDayName(date, idioma = 'es-ES') {
        return new Intl.DateTimeFormat(idioma, { weekday: 'long' }).format(date);
    }

    function centerHourScroll(hourToCenter) {
        const listOfHours = document.getElementById("listOfHours")
        const actualHourElement = listOfHours.children[hourToCenter - 1]
        actualHourElement.classList.add("bg-gray-200")
        actualHourElement.classList.remove("bg-white")

        const elemntListWidth = actualHourElement.offsetWidth
        const elementStyles = getComputedStyle(listOfHours)
        const gap = parseInt(elementStyles.columnGap || elementStyles.gap || '0', 10)

        // Cogemos lo que mide una casilla + gap, por la hora menos 8 pixeles (por las esquinas)
        // para tener la posicion del final de la casilla seleccionada.

        // Luego restamos la mitad del ancho del contenedor para centrar la casilla y por ultimo
        // lo que mide el listOfHours entre 2 para centrarlo del todo.
        const centerValue = (elemntListWidth + gap) * hourToCenter - gap - (elemntListWidth / 2) - listOfHours.offsetWidth / 2

        listOfHours.scrollTo(centerValue, 0)
    }

    function getWeatherEmoji(conditionCode, isDay) {
        return weatherEmojis[conditionCode] ? weatherEmojis[conditionCode][isDay] : "🌍"
    }

    function loadActualWeather() {
        const actualData = listOfWeatherOfHours[actualHourSeen - 1]
        const actualHourElement = listOfHours.children[hour - 1]

        listOfHours.querySelector(".bg-gray-200").classList.add("bg-white")
        listOfHours.querySelector(".bg-gray-200").classList.remove("bg-gray-200")
        actualHourElement.classList.add("bg-white")
        actualHourElement.classList.remove("bg-gray-200")

        document.getElementById("actualHour").innerHTML = actualHourSeen + ":00"
        document.getElementById("uvIndexValue").innerHTML = actualData.uv
        document.getElementById("windStatusValue").innerHTML = actualData.wind_kph
        document.getElementById("humidityValue").innerHTML = actualData.humidity
        document.getElementById("visibilityValue").innerHTML = actualData.vis_km
        document.getElementById("skyCondition").children[0].innerHTML = getCloudlyInfo(actualData.cloud)[0]
        document.getElementById("skyCondition").children[1].innerHTML = getCloudlyInfo(actualData.cloud)[1]
        document.getElementById("weatherPrecipitationIcon").innerHTML = getRainEmoji(actualData.chance_of_rain)
        document.getElementById("weatherPrecipitation").innerHTML = actualData.chance_of_rain + "%"

        centerHourScroll(actualHourSeen)
    }

    function getCloudlyInfo(cloud) {
        if (cloud < 10) {
            return ["☀️", "Despejado"]
        }
        if (cloud < 25) {
            return ["🌤️", "Mayormente despejado"]
        }
        if (cloud < 50) {
            return ["⛅", "Parcialmente nublado"]
        }
        if (cloud < 75) {
            return ["🌥️", "Mayormente nublado"]
        }
        return ["☁️", "Nublado"]
    }

    function getRainEmoji(chanceOfRain) {
        if (chanceOfRain < 10) {
            return "🌧️🚫"
        }
        if (chanceOfRain < 30) {
            return "🌦️"
        }
        if (chanceOfRain < 50) {
            return "🌧️"
        }
        if (chanceOfRain < 70) {
            return "🌧️🌂"
        }
        return "🌧️💧"
    }

    function resetHour() {
        resetHourButton.classList.add("hidden")

        actualHourSeen = hour
        loadActualWeather()
    }
}