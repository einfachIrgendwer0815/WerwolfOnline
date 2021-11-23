from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

import json
from datetime import timedelta

from modules import gameControl
from modules import functions
from modules import routes

app = Flask(__name__)
CORS(app)
app.gameControl = gameControl.GameControl()
app.gameControl.start()
app.gameControl.prepareTables()

app.config['JWT_TOKEN_LOCATION'] = ['query_string']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=12)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(hours=12)

app.register_blueprint(routes.api.blueprint)
app.register_blueprint(routes.app.blueprint)

with open('jwt_secret_key.json') as jsonFile:
    app.config['JWT_SECRET_KEY'] = json.load(jsonFile)['key']

jwt = JWTManager(app)

if __name__ == "__main__":
    app.run(debug=True)
