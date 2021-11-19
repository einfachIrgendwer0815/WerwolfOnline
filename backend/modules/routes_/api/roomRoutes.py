from flask import request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from modules import functions

GAME_CONTROL = None

@jwt_required()
def joinRoom():
    jsonData = request.get_json()

    if jsonData == None:
        jsonData = {}

    roomName = (jsonData['roomName'] if functions.jsonHasField(jsonData, 'roomName') else None)

    if GAME_CONTROL.joinRoom(get_jwt_identity(), roomName) == True:
        return jsonify(refresh=functions.refreshNecessary(), succesfull=True)
    else:
        return jsonify(refresh=functions.refreshNecessary(), succesfull=False)

@jwt_required()
def leaveRoom():
    GAME_CONTROL.leaveRoom(get_jwt_identity())

    return jsonify(refresh=functions.refreshNecessary()), 200

@jwt_required()
def getRoomCode():
    return jsonify(
        roomCode=GAME_CONTROL.getRoomCode(get_jwt_identity()),
        refresh=functions.refreshNecessary()
    ), 200

@jwt_required()
def roomMembers():
    members = GAME_CONTROL.getRoomMembers(get_jwt_identity())

    return jsonify(members=members, refresh=functions.refreshNecessary()), 200

def configureRoutes(app):
    global GAME_CONTROL
    GAME_CONTROL = app.gameControl

    global joinRoom
    joinRoom = app.route('/api/room/join', methods=['GET', 'POST'])(joinRoom)

    global leaveRoom
    leaveRoom = app.route('/api/room/leave', methods=['GET'])(leaveRoom)

    global roomMembers
    roomMembers = app.route('/api/room/members', methods=['GET'])(roomMembers)

    global getRoomCode
    getRoomCode = app.route('/api/room/code', methods=['GET'])(getRoomCode)
