from flask import request, jsonify, Blueprint
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

blueprint = Blueprint("game", __name__, url_prefix='/game')

@blueprint.route('/state')
@jwt_required()
def gameState():
    return '', 200

@blueprint.route('/data')
@jwt_required()
def gameData():
    return '', 200
