from flask import request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from modules import functions

GAME_CONTROL = None

@jwt_required()
def isPlayerRegistered():
    return jsonify(
        isRegistered=GAME_CONTROL.isPlayerRegistered(get_jwt_identity()),
        nicknameSet=GAME_CONTROL.getPlayerNickname(get_jwt_identity()),
        volumeSet=GAME_CONTROL.getVolumeSetting(get_jwt_identity()),
        refresh=functions.refreshNecessary()
    ), 200

@jwt_required()
def registerPlayer():
    #abort(404)
    identity = get_jwt_identity()
    expireTimestamp = get_jwt()['exp']

    if GAME_CONTROL.isPlayerRegistered(identity) == False:
        GAME_CONTROL.registerPlayer(identity, expireTimestamp)

    return jsonify(identity=identity, expireTimestamp=expireTimestamp, refresh=functions.refreshNecessary()), 200

@jwt_required()
def unregisterPlayer():
    GAME_CONTROL.unregisterPlayer(get_jwt_identity())
    return jsonify(refresh=functions.refreshNecessary()), 200

@jwt_required()
def updatePlayerExpireTimestamp():
    GAME_CONTROL.updatePlayerExpireTimestamp(get_jwt_identity(), get_jwt()['exp'])
    return jsonify(refresh=functions.refreshNecessary()), 200

@jwt_required()
def setNickname():
    if (jsonData := request.get_json()) == None or 'nickname' not in jsonData.keys():
        abort(401, 'Missing nickname POST parameter.')

    else:
        nickname = jsonData['nickname'] if len(jsonData['nickname']) <= 20 else jsonData['nickname'][0:20]
        GAME_CONTROL.setPlayerNickname(get_jwt_identity(), nickname)

    return jsonify(refresh=functions.refreshNecessary()), 200

@jwt_required()
def setVolumeSetting():
    if (jsonData := request.get_json()) == None or 'volume' not in jsonData.keys():
        abort(401, 'Missing volume POST parameter.')

    else:
        volume = jsonData['volume']
        if jsonData['volume'] < 0:
            volume = 0
        elif jsonData['volume'] > 100:
            volume = 100
        GAME_CONTROL.setVolumeSetting(get_jwt_identity(), volume)
    return jsonify(refresh=functions.refreshNecessary()), 200

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

    global setNickname
    setNickname = app.route('/api/player/setNickname', methods=['GET', 'POST'])(setNickname)

    global setVolumeSetting
    setVolumeSetting = app.route('/api/player/setVolume', methods=['GET', 'POST'])(setVolumeSetting)
