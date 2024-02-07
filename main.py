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
apiKeyIpInfo = config['API']['ipInfo']

@app.route('/getCity', methods=['GET'])
def obtener_ciudad():
    latitude = request.args.get('latitude', default=None)
    longitude = request.args.get('longitude', default=None)

    if latitude is not None and longitude is not None:
        response = requests.get(f"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={apiKeyMaps}")
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
        


if __name__ == '__main__':
    app.run(debug=True)