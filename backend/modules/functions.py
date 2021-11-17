from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt
from flask import request, abort
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
        target_timestamp = datetime.timestamp(now + timedelta(minutes=10))
        if target_timestamp > exp_timestamp:
            return True

        return False

    except (RuntimeError, KeyError):
        return False

def jsonHasField(jsonText, fieldName):
    if fieldName not in jsonText.keys():
        return False

    return True

def returnAbortMissingParameter(parameterName, code=401):
    abort(401, f'Missing POST parameter \'{parameterName}\'.')

def returnAbortInvalidJson(code=401):
    abort(401, 'Invalid JSON posted.')

def validateVolume(volume):
    if volume < 0:
        return 0
    elif volume > 100:
        return 100

    return volume

def generateName(length=10):
    chars = string.ascii_letters + string.digits

    return ''.join([random.choice(chars) for _ in range(length)])
