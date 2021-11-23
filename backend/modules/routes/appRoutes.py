from flask import request, redirect, render_template, url_for, send_from_directory, Blueprint

import re

blueprint = Blueprint('index', __name__)

@blueprint.route('/', methods=['GET'])
def index():
    if request.accept_languages.best != None and re.match('de.*', request.accept_languages.best):
        return redirect('/de')
    return redirect('/en')

@blueprint.route('/de/', defaults={'file': ''}, methods=['GET'])
@blueprint.route('/de/<path:file>')
def de(file):
    if file == '':
        return render_template('de/index.html')
    else:
        return send_from_directory('static/de', file)

@blueprint.route('/en/', defaults={'file': ''}, methods=['GET'])
@blueprint.route('/en/<path:file>')
def en(file):
    if file == '':
        return render_template('en/index.html')
    else:
        return send_from_directory('static/en', file)

@blueprint.route('/assets/<string:filename>', methods=['GET'])
def assets(filename):
    return send_from_directory('static/assets', filename)
