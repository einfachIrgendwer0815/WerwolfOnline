from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies

from modules import gameControl

from datetime import datetime

app = Flask(__name__)
app.gameControl = gameControl.GameControl()
app.gameControl.start()

app.config['JWT_TOKEN_LOCATION'] = ['query_string']
app.config['JWT_SECRET_KEY'] = "very secrect"

jwt = JWTManager(app)

@app.route('/token/auth', methods=['GET'])
def auth():
    access_token = create_access_token(identity=datetime.now().strftime('%d-%b-%H:%M:%S'))
    refresh_token = create_refresh_token(identity=datetime.now().strftime('%d-%b-%H:%M:%S'))

    resp = jsonify({'access_token': access_token, 'refresh_token': refresh_token})

    return resp, 200

if __name__ == "__main__":
    app.run(debug=True)
