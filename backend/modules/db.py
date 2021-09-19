from modules import config

from sqlIntuitive import dbSystems

config.read_DB_DATA()

def create_mysql_db_system():
    return dbSystems.MySqlDbSystem(host=config.DB_DATA['host'], username=config.DB_DATA['username'], password=config.DB_DATA['password'], database=config.DB_DATA['database'])
