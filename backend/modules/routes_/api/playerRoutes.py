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
        inRoom=GAME_CONTROL.isPlayerInRoom(get_jwt_identity()),
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
def fullRegisterPlayer():
    identity = get_jwt_identity()
    expireTimestamp = get_jwt()['exp']

    if (jsonData := request.get_json()) == None:
        functions.returnAbortInvalidJson()

    if not functions.jsonHasField(jsonData, 'nickname'):
        functions.returnAbortMissingParameter('nickname')

    if not functions.jsonHasField(jsonData, 'volume'):
        functions.returnAbortMissingParameter('volume')

    if GAME_CONTROL.isPlayerRegistered(identity) == False:
        GAME_CONTROL.registerPlayer(identity, expireTimestamp)

    jsonData = request.get_json()

    nickname = jsonData['nickname'] if len(jsonData['nickname']) <= 35 else jsonData['nickname'][0:35]
    GAME_CONTROL.setPlayerNickname(get_jwt_identity(), nickname)

    GAME_CONTROL.setVolumeSetting(get_jwt_identity(), functions.validateVolume(jsonData['volume']))

    res = jsonify(identity=identity, expireTimestamp=expireTimestamp, refresh=functions.refreshNecessary())

    return res, 200

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
    jsonData = request.get_json()
    if jsonData == None:
        functions.returnAbortInvalidJson()


    if not functions.jsonHasField(jsonData, 'nickname'):
        functions.returnAbortMissingParameter('nickname')

    nickname = jsonData['nickname'] if len(jsonData['nickname']) <= 35 else jsonData['nickname'][0:35]
    GAME_CONTROL.setPlayerNickname(get_jwt_identity(), nickname)

    return jsonify(refresh=functions.refreshNecessary()), 200

@jwt_required()
def setVolumeSetting():
    jsonData = request.get_json()
    if jsonData == None:
        functions.returnAbortInvalidJson()

    if not functions.jsonHasField(jsonData, 'volume'):
        return functions.returnAbortMissingParameter('volume')

    GAME_CONTROL.setVolumeSetting(get_jwt_identity(), functions.validateVolume(jsonData['volume']))

    return jsonify(refresh=functions.refreshNecessary()), 200

def configureRoutes(app):
    global GAME_CONTROL
    GAME_CONTROL = app.gameControl

    global isPlayerRegistered
    isPlayerRegistered = app.route('/api/player/isRegistered', methods=['GET'])(isPlayerRegistered)

    global registerPlayer
    registerPlayer = app.route('/api/player/register', methods=['GET','POST'])(registerPlayer)

    global fullRegisterPlayer
    fullRegisterPlayer = app.route('/api/player/fullRegister', methods=['GET', 'POST'])(fullRegisterPlayer)

    global unregisterPlayer
    unregisterPlayer = app.route('/api/player/unregister', methods=['GET'])(unregisterPlayer)

    global updatePlayerExpireTimestamp
    updatePlayerExpireTimestamp = app.route('/api/player/updateExpireTimestamp', methods=['GET'])(updatePlayerExpireTimestamp)

    global setNickname
    setNickname = app.route('/api/player/setNickname', methods=['GET', 'POST'])(setNickname)

    global setVolumeSetting
    setVolumeSetting = app.route('/api/player/setVolume', methods=['GET', 'POST'])(setVolumeSetting)
