from flask import request, jsonify, Blueprint
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

import json

from modules import functions

blueprint = Blueprint('token', __name__, url_prefix='/token')

@blueprint.route('/generate', methods=['GET'])
def getToken():
    access_token, refresh_token = functions.genToken()

    resp = jsonify(access_token=access_token, refresh_token=refresh_token)

    return resp, 200

@blueprint.route('/reGenToken', methods=['GET'])
@jwt_required(refresh=True)
def getNewToken():
    access_token, refresh_token = functions.genToken(identity=get_jwt_identity())

    resp = jsonify(access_token=access_token, refresh_token=refresh_token)

    return resp, 200

@blueprint.route('/getIdentity', methods=['GET'])
@jwt_required(refresh=False)
def getIdentity():
    return jsonify(identity=get_jwt_identity(), token=request.args['jwt'], refresh=functions.refreshNecessary(), expireTimestamp=get_jwt()['exp'])
