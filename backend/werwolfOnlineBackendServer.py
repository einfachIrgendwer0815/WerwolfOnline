from flask import Flask, request
import logging

from modules import gameControl

app = Flask(__name__)
app.gameControl = gameControl.GameControl()
app.gameControl.start()

if __name__ == "__main__":
    app.run(debug=True)
