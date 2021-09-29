from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies

import json

from modules import gameControl

from datetime import datetime

app = Flask(__name__)
app.gameControl = gameControl.GameControl()
app.gameControl.start()

app.config['JWT_TOKEN_LOCATION'] = ['query_string']

with open('jwt_secret_key.json') as jsonFile:
    app.config['JWT_SECRET_KEY'] = json.load(jsonFile)['key']

jwt = JWTManager(app)

@app.route('/token/auth', methods=['GET'])
def auth():
    identity = f'{request.remote_addr}-{datetime.now().strftime("%d-%b-%H:%M:%S")}'
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    resp = jsonify({'access_token': access_token, 'refresh_token': refresh_token})

    return resp, 200

if __name__ == "__main__":
    app.run(debug=True)
