from modules.routes_ import api

def configureRoutes(app):
    api.playerRoutes.configureRoutes(app)
    api.tokenRoutes.configureRoutes(app)
    api.roomRoutes.configureRoutes(app)
    api.gameRoutes.configureRoutes(app)
