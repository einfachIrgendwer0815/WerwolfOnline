from flask import request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

GAME_CONTROL = None

@jwt_required()
def gameState():
    return '', 200

@jwt_required()
def gameData():
    return '', 200

def configureRoutes(app):
    GAME_CONTROL = app.gameControl
    
    global gameState
    gameState = app.route('/api/game/state', methods=['GET'])(gameState)

    global gameData
    gameData = app.route('/api/game/data', methods=['GET'])(gameData)
