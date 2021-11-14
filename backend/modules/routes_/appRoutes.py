from flask import request, redirect, render_template, url_for, send_from_directory

import re

def index():
    if request.accept_languages.best != None and re.match('de.*', request.accept_languages.best):
        return redirect('/de')
    return redirect('/en')

def de(file):
    if file == '':
        return render_template('de/index.html')
    else:
        return send_from_directory('static/de', file)

def en(file):
    if file == '':
        return render_template('en/index.html')
    else:
        return send_from_directory('static/en', file)

def assets(filename):
    print(filename)
    return send_from_directory('static/assets', filename)

def configureRoutes(app):
    global index
    index = app.route('/')(index)

    global de
    de = app.route('/de/', defaults={'file': ''})(de)
    de = app.route('/de/<path:file>')(de)

    global en
    en = app.route('/en/', defaults={'file': ''})(en)
    en = app.route('/en/<path:file>')(en)

    global assets
    assets = app.route('/assets/<string:filename>')(assets)
