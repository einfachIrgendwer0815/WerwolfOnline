from flask import request, jsonify, Blueprint, g
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from modules import functions

blueprint = Blueprint('room', __name__, url_prefix='/room')

blueprint.after_request(functions.add_refresh_header)

@blueprint.route('/join', methods=['GET', 'POST'])
@jwt_required()
def joinRoom():
    if g.gameControl.getPlayerNickname(get_jwt_identity()) == None:
        return jsonify(successful=False)

    jsonData = request.get_json()

    if jsonData == None:
        jsonData = {}

    roomName = (jsonData['roomName'] if functions.jsonHasField(jsonData, 'roomName') else None)
    roomIsPublic = (jsonData['roomIsPublic'] if functions.jsonHasField(jsonData, 'roomIsPublic') else None)
    roomPlayerLimit = (jsonData['roomPlayerLimit'] if functions.jsonHasField(jsonData, 'roomPlayerLimit') else None)

    if g.gameControl.joinRoom(get_jwt_identity(), roomName=roomName, roomIsPublic=roomIsPublic, roomPlayerLimit=roomPlayerLimit) == True:
        return jsonify(successful=True)
    else:
        return jsonify(successful=False)

@blueprint.route('/leave', methods=['GET', 'POST'])
@jwt_required()
def leaveRoom():
    g.gameControl.leaveRoom(get_jwt_identity())

    return jsonify(), 200

@blueprint.route('/code', methods=['GET'])
@jwt_required()
def getRoomCode():
    return jsonify(
        roomCode=g.gameControl.getRoomCode(get_jwt_identity())
    ), 200

@blueprint.route('/doesRoomExist', methods=['GET', 'POST'])
def doesRoomExist():
    jsonData = request.get_json()

    if jsonData == None:
        jsonData = {}

    roomName = (jsonData['roomName'] if functions.jsonHasField(jsonData, 'roomName') else None)

    if roomName == None:
        functions.returnAbortMissingParameter('roomName')
    else:
        return jsonify(
            exists=g.gameControl.doesRoomExist(roomName)
        ), 200

@blueprint.route('/isPublic', methods=['GET'])
@jwt_required()
def isPublic():
    return jsonify(
        public=g.gameControl.isRoomPublic(get_jwt_identity())
    ), 200

@blueprint.route('/playerLimit', methods=['GET'])
@jwt_required()
def getPlayerLimit():
    return jsonify(
        limit=g.gameControl.getRoomPlayerLimit(get_jwt_identity())
    ), 200

@blueprint.route('/members', methods=['GET'])
@jwt_required()
def roomMembers():
    members = g.gameControl.getRoomMembers(get_jwt_identity())

    return jsonify(members=members), 200

@blueprint.route('/publics', methods=['GET'])
def getPublicRooms():
    return jsonify(
        rooms=g.gameControl.getPublicRooms()
    ), 200

@blueprint.route('/info', methods=['GET'])
@jwt_required()
def getInfo():
    return jsonify(
        code=g.gameControl.getRoomCode(get_jwt_identity()),
        members=g.gameControl.getRoomMembers(get_jwt_identity()),
        public=g.gameControl.isRoomPublic(get_jwt_identity())
    ), 200
