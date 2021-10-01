from flask import request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

import json

from modules import functions

def getToken():
    access_token, refresh_token = functions.genToken()

    resp = jsonify(access_token=access_token, refresh_token=refresh_token)

    return resp, 200

@jwt_required(refresh=True)
def getNewToken():
    access_token, refresh_token = functions.genToken(identity=get_jwt_identity())

    resp = jsonify(access_token=access_token, refresh_token=refresh_token)

    return resp, 200

@jwt_required(refresh=False)
def getIdentity():
    return jsonify(identity=get_jwt_identity(), token=request.args['jwt'], refresh=functions.refreshNecessary())

def configureRoutes(app):
    global getToken
    getToken = app.route('/api/token/generate', methods=['GET'])(getToken)

    global getNewToken
    getNewToken = app.route('/api/token/reGenToken', methods=['GET'])(getNewToken)

    global getIdentity
    getIdentity = app.route('/api/token/getIdentity', methods=['GET'])(getIdentity)
