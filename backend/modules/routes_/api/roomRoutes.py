from flask import request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

@jwt_required()
def joinRoom():
    return '', 200

@jwt_required()
def leaveRoom():
    return '', 200

@jwt_required()
def roomMembers():
    return '', 200

@jwt_required()
def roomData():
    return '', 200

def configureRoutes(app):
    global joinRoom
    joinRoom = app.route('/api/room/join', methods=['GET', 'POST'])(joinRoom)

    global leaveRoom
    leaveRoom = app.route('/api/room/leave', methods=['GET'])(leaveRoom)

    global roomMembers
    roomMembers = app.route('/api/room/members', methods=['GET'])(roomMembers)

    global roomData
    roomData = app.route('/api/room/data', methods=['GET'])(roomData)
