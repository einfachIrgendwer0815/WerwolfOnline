from modules import db
from modules import customDecorators

@customDecorators.Singleton
class GameControl():
    def __init__(self):
        self.__dbSystem = db.create_mysql_db_system()

        self.__running = False

    def start(self):
        if self.__running != False:
            return

        self.__dbSystem.connect_to_db()
        self.__dbSystem.create_cursor()

        self.__running = True

    def prepareTables(self):
        if self.__running != True:
            return

        self.__dbSystem.create_table('Player', {'identity': 'varchar(40)', 'expireTimestamp': 'int', 'room': 'varchar(10)', 'game': 'varchar(10)', 'nickname': 'varchar(35)', 'volumeSetting': 'int'})

    def stop(self):
        if self.__running != True:
            return

        self.__dbSystem.close_connection()

        self.__running = False

    def registerPlayer(self, identity, expireTimestamp):
        self.__dbSystem.insert_into('Player', {'identity': identity, 'expireTimestamp': expireTimestamp})

    def isPlayerRegistered(self, identity):
        resp = self.__dbSystem.select_from('Player', ['identity'], {'identity': identity})
        if len(resp) > 0:
            return True

        return False

    def unregisterPlayer(self, identity):
        self.__dbSystem.delete_from('Player', {'identity': identity})

    def updatePlayerExpireTimestamp(self, identity, newExpire):
        self.__dbSystem.update('Player', {'expireTimestamp': newExpire}, {'identity': identity})

    def getPlayerNickname(self, identity):
        res = self.__dbSystem.select_from('Player', ['nickname'], {'identity': identity})

        if len(res) > 0 and res[0][0] != None:
            return True
        else:
            return False

    def getVolumeSetting(self, identity):
        res = self.__dbSystem.select_from('Player', ['volumeSetting'], {'identity': identity})

        if len(res) > 0 and res[0][0] != None:
            return True
        else:
            return False

    def setPlayerNickname(self, identity, nickname):
        self.__dbSystem.update('Player', {'nickname': nickname}, {'identity': identity})

    def setVolumeSetting(self, identity, volume):
        self.__dbSystem.update('Player', {'volumeSetting': volume}, {'identity': identity})
