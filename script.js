window.addEventListener("DOMContentLoaded", main)

function main() {
    obtenerCiudad()

    function quitarAcentos(cadena) {
        return cadena.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    async function getCity({ latitude, longitude }) {
        const configuracion = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (latitude === undefined || longitude === undefined) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/getCity`, configuracion);
                const data = await response.json();
                const returnCity = data.city ?? "Cornellà de Llobregat (pero no el real de nuevo)"

                return quitarAcentos(returnCity);
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/getCity?latitude=${latitude}&longitude=${longitude}`, configuracion);
            const data = await response.json();

            const city = data.plus_code.compound_code;
            const citySeparada = city.split(" ");
            const citySinPrimerElemento = citySeparada.slice(1);
            const cityString = citySinPrimerElemento.join(' ');

            return quitarAcentos(cityString);
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }

    }

    function obtenerUbicacion() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        // console.log('Ubicación obtenida:', latitude, longitude);
                        resolve({ latitude, longitude });
                    },
                    error => {
                        console.error('Error al obtener la ubicación:', error.message);
                        reject(error);
                    }
                );
            } else {
                console.error('La geolocalización no es compatible en este navegador.');
                reject(new Error('Geolocalización no compatible'));
            }
        });
    }

    async function obtenerCiudad() {
        let position = { "latitude": undefined, "longitude": undefined };
        try {
            position = await obtenerUbicacion();
        } catch (error) {
            console.error("Error al obtener la ubicación:", error.message);
        }

        try {
            const resultado = await getCity(position);
            console.log(resultado);
            // A partir de aqui ya puedo obtener la ciudad vastante bien
        } catch (error) {
            console.error("Error al obtener la ciudad:", error.message);
        }
    }
}