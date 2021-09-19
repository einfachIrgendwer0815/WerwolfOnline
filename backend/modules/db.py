from modules import decoratedClasses
from modules import config

config.read_DB_DATA()

MYSQL_DB_SYSTEM = None

def create_mysql_db_system():
    global MYSQL_DB_SYSTEM
    if MYSQL_DB_SYSTEM != None:
        return

    MYSQL_DB_SYSTEM = decoratedClasses.dbSystem(host=config.DB_DATA['host'], username=config.DB_DATA['username'], password=config.DB_DATA['password'], database=config.DB_DATA['database'])
