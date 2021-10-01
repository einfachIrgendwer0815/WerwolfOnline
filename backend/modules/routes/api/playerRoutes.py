def isPlayerRegistered():
    return '', 200

def registerPlayer():
    return '', 200

def unregisterPlayer():
    return '', 200

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
