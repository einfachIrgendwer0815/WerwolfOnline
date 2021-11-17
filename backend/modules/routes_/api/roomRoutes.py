from flask import request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from modules import functions

GAME_CONTROL = None

@jwt_required()
def joinRoom():
    jsonData = request.get_json()

    if jsonData == None:
        functions.returnAbortInvalidJson()

    if not functions.jsonHasField(jsonData, 'roomName'):
        functions.returnAbortMissingParameter('roomName')

    if GAME_CONTROL.joinRoom(get_jwt_identity(), jsonData['roomName']) == True:
        return jsonify(refresh=functions.refreshNecessary(), succesfull=True)
    else:
        return jsonify(refresh=functions.refreshNecessary(), succesfull=False)

@jwt_required()
def leaveRoom():
    GAME_CONTROL.leaveRoom(get_jwt_identity())

    return jsonify(refresh=functions.refreshNecessary()), 200

@jwt_required()
def createRoom():
    state, room = GAME_CONTROL.createRoom()

    if state == False:
        return jsonify(refresh=functions.refreshNecessary()), 500
    else:
        return jsonify(refresh=functions.refreshNecessary(), roomName=room), 200

@jwt_required()
def roomMembers():
    return '', 200

def configureRoutes(app):
    global GAME_CONTROL
    GAME_CONTROL = app.gameControl

    global joinRoom
    joinRoom = app.route('/api/room/join', methods=['GET', 'POST'])(joinRoom)

    global leaveRoom
    leaveRoom = app.route('/api/room/leave', methods=['GET'])(leaveRoom)

    global createRoom
    createRoom = app.route('/api/room/create', methods=['GET'])(createRoom)

    global roomMembers
    roomMembers = app.route('/api/room/members', methods=['GET'])(roomMembers)
