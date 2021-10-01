from modules import routes_

def configureRoutes(app):
    routes_.appRoutes.configureRoutes(app)
    routes_.apiRoutes.configureRoutes(app)
