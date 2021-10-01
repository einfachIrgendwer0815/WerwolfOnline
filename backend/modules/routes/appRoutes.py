from flask import request, redirect, render_template, url_for

import re

def index():
    if re.match('de.*', request.accept_languages.best):
        return redirect('/de')
    return redirect('/en')

def de():
    return render_template('de/index.html')

def en():
    return render_template('en/index.html')

def assets(filename):
    return redirect(url_for('static', filename=f'assets/{filename}'))

def configureRoutes(app):
    global index
    index = app.route('/')(index)

    global de
    de = app.route('/de/')(de)
    de = app.route('/static/de/')(de)

    global en
    en = app.route('/en/')(en)
    en = app.route('/static/en')(en)

    global assets
    assets = app.route('/assets/<string:filename>')(assets)
