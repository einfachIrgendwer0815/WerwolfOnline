from flask import Flask
from flask_jwt_extended import JWTManager

import json
from datetime import timedelta

from modules import gameControl
from modules import functions
from modules import routes

app = Flask(__name__)
app.gameControl = gameControl.GameControl()
app.gameControl.start()

app.config['JWT_TOKEN_LOCATION'] = ['query_string']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=14)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=14)

with open('jwt_secret_key.json') as jsonFile:
    app.config['JWT_SECRET_KEY'] = json.load(jsonFile)['key']

jwt = JWTManager(app)

routes.configureRoutes(app)

if __name__ == "__main__":
    app.run(debug=True)
