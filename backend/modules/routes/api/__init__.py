from flask import Blueprint
from modules.routes.api import playerRoutes, tokenRoutes, roomRoutes, gameRoutes

blueprint = Blueprint('api', __name__, url_prefix='/api')

blueprint.register_blueprint(playerRoutes.blueprint)
blueprint.register_blueprint(tokenRoutes.blueprint)
blueprint.register_blueprint(roomRoutes.blueprint)
blueprint.register_blueprint(gameRoutes.blueprint)
