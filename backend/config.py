import json

DB_DATA = None

def read_DB_DATA():
    with open('dbData/data.json', 'r') as file:
        DB_DATA = json.load(file)
