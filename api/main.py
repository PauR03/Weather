from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import configparser
from urllib.parse import quote

# Funciones que tengo en el archivo utils.py
import utils as u

app = Flask(__name__)
CORS(app)

config = configparser.ConfigParser()
config.read('config.ini')

apiKeyWeather = config['API']['weather']
apiKeyIpInfo = config['API']['ipInfo']

# Configuración de depuración
DEVELOP = True

@app.route('/getMoonPhase', methods=['GET'])
def getMoonPhase():
    daysToAdvance = request.args.get('dayAdvance')

    if daysToAdvance is not None and daysToAdvance.isdigit():
        daysToAdvance = int(daysToAdvance)
    else:
        daysToAdvance = 0

    porcentajeIluminado = u.obtener_porcentaje_iluminacion(daysToAdvance)
    fasesLunares = u.obtener_diccionario_fases_lunares(porcentajeIluminado, daysToAdvance)

    result_dict = {
        "porcentajeIluminado": porcentajeIluminado,
        "fasesLunares": fasesLunares
    }

    return result_dict

@app.route('/getWeatherToday', methods=['GET'])
def getWeatherToday():
    city = request.args.get('city')

    try:
        if city is None:
            ip = request.environ['HTTP_X_FORWARDED_FOR'] if 'HTTP_X_FORWARDED_FOR' in request.environ else request.remote_addr

            # Im using a fixed IP for testing
            if DEVELOP:
                # Barcelona "90.167.86.54"
                # Cornella "37.133.42.193"
                ip = "37.133.42.193"

            getCity = requests.get(f"https://ipinfo.io/{ip}?token={apiKeyIpInfo}")
            getCity.raise_for_status()
            city = getCity.json()['city']
            city = u.quitar_acentos(city)

        response = requests.get(f"http://api.weatherapi.com/v1/forecast.json?key={apiKeyWeather}&q={quote(city)}&days=1&aqi=no&alerts=no")
        response.raise_for_status()
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f'Error en la solicitud API'}), 500
    except KeyError:
        return jsonify({"error": 'Error al obtener la ciudad de la respuesta'}), 500
    except Exception as e:
        return jsonify({"error": f'Error inesperado'}), 500

@app.route('/getWeatherWeek', methods=['GET'])
def getWeatherWeek():
    city = request.args.get('city')

    try:
        if city is None:
            ip = request.environ['HTTP_X_FORWARDED_FOR'] if 'HTTP_X_FORWARDED_FOR' in request.environ else request.remote_addr

            # Im using a fixed IP for testing
            if DEVELOP:
                # Barcelona "90.167.86.54"
                # Cornella "37.133.42.193"
                ip = "37.133.42.193"

            getCity = requests.get(f"https://ipinfo.io/{ip}?token={apiKeyIpInfo}")
            getCity.raise_for_status()
            city = getCity.json()['city']
            city = u.quitar_acentos(city)

        response = requests.get(f"http://api.weatherapi.com/v1/forecast.json?key={apiKeyWeather}&q={quote(city)}&days=7&aqi=no&alerts=no")
        response.raise_for_status()
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f'Error en la solicitud API'}), 500
    except KeyError:
        return jsonify({"error": 'Error al obtener la ciudad de la respuesta'}), 500
    except Exception as e:
        return jsonify({"error": f'Error inesperado'}), 500

if __name__ == '__main__':
    app.run(debug=True)