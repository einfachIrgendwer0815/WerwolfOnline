from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

GAME_CONTROL = None

@jwt_required()
def isPlayerRegistered():
    return jsonify(isRegistered=GAME_CONTROL.isPlayerRegistered(get_jwt_identity())), 200

@jwt_required()
def registerPlayer():
    identity = get_jwt_identity()
    expireTimestamp = get_jwt()['exp']

    if GAME_CONTROL.isPlayerRegistered(identity) == False:
        GAME_CONTROL.registerPlayer(identity, expireTimestamp)

    return jsonify(identity=identity, expireTimestamp=expireTimestamp), 200

@jwt_required()
def unregisterPlayer():
    return '', 200

@jwt_required()
def updatePlayerExpireTimestamp():
    return '', 200

def configureRoutes(app):
    global GAME_CONTROL
    GAME_CONTROL = app.gameControl

    global isPlayerRegistered
    isPlayerRegistered = app.route('/api/player/isRegistered', methods=['GET'])(isPlayerRegistered)

    global registerPlayer
    registerPlayer = app.route('/api/player/register', methods=['GET','POST'])(registerPlayer)

    global unregisterPlayer
    unregisterPlayer = app.route('/api/player/unregister', methods=['GET'])(unregisterPlayer)

    global updatePlayerExpireTimestamp
    updatePlayerExpireTimestamp = app.route('/api/player/updateExpireTimestamp', methods=['GET'])(updatePlayerExpireTimestamp)
