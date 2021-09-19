import json

DB_DATA = None

def read_DB_DATA():
    global DB_DATA

    if DB_DATA != None:
        return
        
    with open('dbData/data.json', 'r') as file:
        DB_DATA = json.load(file)
