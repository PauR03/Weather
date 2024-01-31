from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import configparser

app = Flask(__name__)
CORS(app)

config = configparser.ConfigParser()
config.read('config.ini')

apiKeyMaps = config['API']['googleMaps']
apiKeyWeather = config['API']['weather']

@app.route('/getIP', methods=['GET'])
def obtener_ip():
    if 'HTTP_X_FORWARDED_FOR' in request.environ:
        ip = request.environ['HTTP_X_FORWARDED_FOR']
    else:
        ip = request.remote_addr
    response = jsonify({"ip": ip})
    # response.headers.add('application/json', '*')
    return response

@app.route('/getCity', methods=['GET'])
def obtener_ciudad():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    if latitude is not None and longitude is not None:
        response = requests.get(f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={apiKeyMaps}")
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            # Imprimir un mensaje de error si la solicitud no fue exitosa
            return (f'Error en la solicitud: {response.status_code}')
    else:
        return jsonify({"error": "La solicitud no contiene los parámetros requeridos"}), 400


if __name__ == '__main__':
    app.run(debug=True)