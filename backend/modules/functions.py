from flask_jwt_extended import create_access_token
from flask import request
from datetime import datetime

import random
import string

def genToken(identity=None):
    if identity == None:
        randomValue = ''.join([random.choice(string.ascii_letters) for _ in range(5)])
        identity = f'{request.remote_addr}-{datetime.now().strftime("%d-%b-%H:%M:%S")}-{randomValue}'

    access_token = create_access_token(identity=identity)

    return access_token
