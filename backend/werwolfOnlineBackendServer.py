from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

import json

from modules import gameControl
from modules import functions

app = Flask(__name__)
app.gameControl = gameControl.GameControl()
app.gameControl.start()

app.config['JWT_TOKEN_LOCATION'] = ['query_string']

with open('jwt_secret_key.json') as jsonFile:
    app.config['JWT_SECRET_KEY'] = json.load(jsonFile)['key']

jwt = JWTManager(app)

@app.route('/api/token/generate', methods=['GET'])
def getToken():
    access_token = functions.genToken()

    resp = jsonify(access_token=access_token)

    return resp, 200

@app.route('/api/token/reGenToken', methods=['GET'])
@jwt_required()
def getNewToken():
    access_token = functions.genToken(identity=get_jwt_identity())

    resp = jsonify(access_token=access_token)

    return resp, 200

@app.route('/api/token/getIdentity', methods=['GET'])
@jwt_required()
def getIdentity():
    return jsonify(identity=get_jwt_identity(), token=request.args['jwt'])

if __name__ == "__main__":
    app.run(debug=True)
