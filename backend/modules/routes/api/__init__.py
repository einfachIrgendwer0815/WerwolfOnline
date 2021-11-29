from flask import Blueprint, g
from modules.gameControl import GameControl
from modules.routes.api import playerRoutes, tokenRoutes, roomRoutes, gameRoutes

blueprint = Blueprint('api', __name__, url_prefix='/api')

blueprint.register_blueprint(playerRoutes.blueprint)
blueprint.register_blueprint(tokenRoutes.blueprint)
blueprint.register_blueprint(roomRoutes.blueprint)
blueprint.register_blueprint(gameRoutes.blueprint)

@blueprint.before_request
def load_gameControl():
    g.gameControl = GameControl()
    g.gameControl.start()
    g.gameControl.prepareTables()

@blueprint.after_request
def close_gameControl(resp):
    g.gameControl.stop()

    return resp
