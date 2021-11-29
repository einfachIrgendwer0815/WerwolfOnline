from flask import request, jsonify, Blueprint, g
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from modules import functions

blueprint = Blueprint('room', __name__, url_prefix='/room')

@blueprint.route('/join', methods=['GET', 'POST'])
@jwt_required()
def joinRoom():
    if g.gameControl.getPlayerNickname(get_jwt_identity()) == None:
        return jsonify(refresh=functions.refreshNecessary(), succesfull=False)

    jsonData = request.get_json()

    if jsonData == None:
        jsonData = {}

    roomName = (jsonData['roomName'] if functions.jsonHasField(jsonData, 'roomName') else None)

    if g.gameControl.joinRoom(get_jwt_identity(), roomName) == True:
        return jsonify(refresh=functions.refreshNecessary(), succesfull=True)
    else:
        return jsonify(refresh=functions.refreshNecessary(), succesfull=False)

@blueprint.route('/leave', methods=['GET', 'POST'])
@jwt_required()
def leaveRoom():
    g.gameControl.leaveRoom(get_jwt_identity())

    return jsonify(refresh=functions.refreshNecessary()), 200

@blueprint.route('/code', methods=['GET'])
@jwt_required()
def getRoomCode():
    return jsonify(
        roomCode=g.gameControl.getRoomCode(get_jwt_identity()),
        refresh=functions.refreshNecessary()
    ), 200

@blueprint.route('/members', methods=['GET'])
@jwt_required()
def roomMembers():
    members = g.gameControl.getRoomMembers(get_jwt_identity())

    return jsonify(members=members, refresh=functions.refreshNecessary()), 200
