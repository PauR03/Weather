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

apiOpenCage = config['API']['openCage']
apiKeyWeather = config['API']['weather']
apiKeyIpInfo = config['API']['ipInfo']

@app.route('/getCity', methods=['GET'])
def getUserCity():
    latitude = request.args.get('latitude', default=None)
    longitude = request.args.get('longitude', default=None)

    if latitude is not None and longitude is not None:
        response = requests.get(f"https://api.opencagedata.com/geocode/v1/json?key={apiOpenCage}&q={latitude}%2C+{longitude}&pretty=1&no_annotations=1")
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            # Imprimir un mensaje de error si la solicitud no fue exitosa
            return (f'Error en la solicitud: {response.status_code}')
    else:
        ip = request.environ['HTTP_X_FORWARDED_FOR'] if 'HTTP_X_FORWARDED_FOR' in request.environ else request.remote_addr
        response = requests.get(f"https://ipinfo.io/{ip}?token={apiKeyIpInfo}")
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            # Imprimir un mensaje de error si la solicitud no fue exitosa
            return (f'Error en la solicitud: {response.status_code}')

@app.route('/getMoonPhase', methods=['GET'])
def getMoonPhase():
    porcentajeIluminado = u.obtener_porcentaje_iluminacion()
    fasesLunares = u.obtener_diccionario_fases_lunares(porcentajeIluminado)

    result_dict = {
        "porcentajeIluminado": porcentajeIluminado,
        "fasesLunares": fasesLunares
    }

    return result_dict

@app.route('/getWeather', methods=['GET'])
def getWeather():
    city = request.args.get('city', default=None)

    if city is not None:
        response = requests.get(f"http://api.weatherapi.com/v1/forecast.json?key={apiKeyWeather}&q={quote(city)}&days=1&aqi=no&alerts=no")
    
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            # Imprimir un mensaje de error si la solicitud no fue exitosa
            return (f'Error en la solicitud: {response.status_code}')
    else:
        return (f'Error: No se ha proporcionado una ciudad')

if __name__ == '__main__':
    app.run(debug=True)