from flask import Flask, jsonify, session
from flask_session import Session

import string
import random

app = Flask(__name__)
app.secret_key = ''.join([random.choice(string.ascii_letters + string.digits) for i in range(20)])
SESSION_PERMANENT = False

@app.route("/")
def index():
    return "Webpage"

if __name__ == "__main__":
    app.run(debug=True)
