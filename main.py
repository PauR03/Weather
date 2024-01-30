from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/getIP', methods=['GET'])
def obtener_ubicacion():
    if 'HTTP_X_FORWARDED_FOR' in request.environ:
        ip = request.environ['HTTP_X_FORWARDED_FOR']
    else:
        ip = request.remote_addr
    response = jsonify({"ip": ip})
    # response.headers.add('application/json', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True)