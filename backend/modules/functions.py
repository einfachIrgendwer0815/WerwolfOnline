from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt
from flask import request
from datetime import datetime, timezone, timedelta

import random
import string

def genToken(identity=None):
    if identity == None:
        randomValue = ''.join([random.choice(string.ascii_letters) for _ in range(5)])
        identity = f'{request.remote_addr}-{datetime.now().strftime("%d-%b-%H:%M:%S")}-{randomValue}'

    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    return access_token, refresh_token

def refreshNecessary():
    try:
        exp_timestamp = get_jwt()['exp']
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            return True

        return False

    except (RuntimeError, KeyError):
        return False
