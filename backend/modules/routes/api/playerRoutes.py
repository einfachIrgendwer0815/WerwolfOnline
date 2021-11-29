from flask import request, jsonify, abort, Blueprint, g
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from modules import functions

blueprint = Blueprint('player', __name__, url_prefix='/player')

@blueprint.route('/isRegistered', methods=['GET'])
@jwt_required()
def isPlayerRegistered():
    return jsonify(
        isRegistered=g.gameControl.isPlayerRegistered(get_jwt_identity()),
        nicknameSet=g.gameControl.getPlayerNickname(get_jwt_identity()),
        volumeSet=g.gameControl.getVolumeSetting(get_jwt_identity()),
        inRoom=g.gameControl.isPlayerInRoom(get_jwt_identity()),
        refresh=functions.refreshNecessary()
    ), 200

@blueprint.route('/register', methods=['GET', 'POST'])
@jwt_required()
def registerPlayer():
    #abort(404)
    identity = get_jwt_identity()
    expireTimestamp = get_jwt()['exp']

    if g.gameControl.isPlayerRegistered(identity) == False:
        g.gameControl.registerPlayer(identity, expireTimestamp)

    return jsonify(identity=identity, expireTimestamp=expireTimestamp, refresh=functions.refreshNecessary()), 200

@blueprint.route('/fullRegister', methods=['GET', 'POST'])
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

    if g.gameControl.isPlayerRegistered(identity) == False:
        g.gameControl.registerPlayer(identity, expireTimestamp)

    jsonData = request.get_json()

    nickname = jsonData['nickname'] if len(jsonData['nickname']) <= 35 else jsonData['nickname'][0:35]
    g.gameControl.setPlayerNickname(get_jwt_identity(), nickname)

    g.gameControl.setVolumeSetting(get_jwt_identity(), functions.validateVolume(jsonData['volume']))

    res = jsonify(identity=identity, expireTimestamp=expireTimestamp, refresh=functions.refreshNecessary())

    return res, 200

@blueprint.route('/unregister', methods=['GET'])
@jwt_required()
def unregisterPlayer():
    g.gameControl.unregisterPlayer(get_jwt_identity())
    return jsonify(refresh=functions.refreshNecessary()), 200

@blueprint.route('/updateExpireTimestamp')
@jwt_required()
def updatePlayerExpireTimestamp():
    g.gameControl.updatePlayerExpireTimestamp(get_jwt_identity(), get_jwt()['exp'])
    return jsonify(refresh=functions.refreshNecessary()), 200

@blueprint.route('/setNickname', methods=['GET', 'POST'])
@jwt_required()
def setNickname():
    jsonData = request.get_json()
    if jsonData == None:
        functions.returnAbortInvalidJson()


    if not functions.jsonHasField(jsonData, 'nickname'):
        functions.returnAbortMissingParameter('nickname')

    nickname = jsonData['nickname'] if len(jsonData['nickname']) <= 35 else jsonData['nickname'][0:35]
    g.gameControl.setPlayerNickname(get_jwt_identity(), nickname)

    return jsonify(refresh=functions.refreshNecessary()), 200

@blueprint.route('/setVolume', methods=['GET', 'POST'])
@jwt_required()
def setVolumeSetting():
    jsonData = request.get_json()
    if jsonData == None:
        functions.returnAbortInvalidJson()

    if not functions.jsonHasField(jsonData, 'volume'):
        return functions.returnAbortMissingParameter('volume')

    g.gameControl.setVolumeSetting(get_jwt_identity(), functions.validateVolume(jsonData['volume']))

    return jsonify(refresh=functions.refreshNecessary()), 200
