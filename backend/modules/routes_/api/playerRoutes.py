from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@jwt_required()
def isPlayerRegistered():
    return '', 200

@jwt_required()
def registerPlayer():
    return '', 200

@jwt_required()
def unregisterPlayer():
    return '', 200

@jwt_required()
def updatePlayerExpireTimestamp():
    return '', 200

def configureRoutes(app):
    global isPlayerRegistered
    isPlayerRegistered = app.route('/api/player/isRegistered', methods=['GET'])(isPlayerRegistered)

    global registerPlayer
    registerPlayer = app.route('/api/player/register', methods=['GET','POST'])(registerPlayer)

    global unregisterPlayer
    unregisterPlayer = app.route('/api/player/unregister', methods=['GET'])(unregisterPlayer)

    global updatePlayerExpireTimestamp
    updatePlayerExpireTimestamp = app.route('/api/player/updateExpireTimestamp', methods=['GET'])(updatePlayerExpireTimestamp)
