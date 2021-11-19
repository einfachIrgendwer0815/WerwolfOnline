from modules import db
from modules import customDecorators

from modules import functions

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

        self.__dbSystem.create_table('Games', {'name': 'varchar(10)', 'activeRoles': 'int', 'actionType': 'int'}, primaryKeys=['name'])
        self.__dbSystem.create_table('Rooms', {'name': 'varchar(10)', 'game': 'varchar(10)'}, primaryKeys=['name'], foreignKeys={'game': 'Games(name)'})
        self.__dbSystem.create_table('Player', {'identity': 'varchar(40)', 'expireTimestamp': 'int', 'room': 'varchar(10)', 'roomAdmin': 'boolean', 'nickname': 'varchar(35)', 'volumeSetting': 'int'}, uniqueColumns=['identity'], foreignKeys={'room': 'Rooms(name)'})
        self.__dbSystem.create_table('PlayerData', {'identity': 'varchar(40)', 'role': 'int', 'votedFor': 'varchar(40)', 'skipsVoting': 'int'}, uniqueColumns=['identity'], foreignKeys={'identity': 'Player(identity)', 'votedFor': 'Player(identity)'})

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

    def createRoom(self, name=None, maxRetries=5, retryNo=0):
        name = (name if name != None else functions.generateName())
        res = self.__dbSystem.select_from('Rooms', ['name'], {'name': name})

        if len(res) == 0:
            self.__dbSystem.insert_into('Rooms', {'name': name})
            return True, name

        if retryNo >= maxRetries:
            return False, None
        else:
            return self.createRoom(retryNo=retryNo+1)

    def joinRoom(self, identity, roomName=None):
        asAdmin = False
        if roomName == None:
            success, roomName = self.createRoom()
            if success == False:
                return False

            asAdmin = True

        else:
            res = self.__dbSystem.select_from('Rooms', ['name'], {'name': roomName})

            if len(res) == 0:
                success, roomName = self.createRoom(name=roomName)
                if success == False:
                    return False

                asAdmin = True

        res = self.__dbSystem.select_from('Player', ['room'], {'identity': identity})

        if len(res) >= 0 and res[0][0] != None:
            if res[0][0] != roomName:
                self.leaveRoom(identity)
        elif len(res) == 0:
            return False

        self.__dbSystem.update('Player', {'room': roomName, 'roomAdmin': asAdmin}, {'identity': identity})

        return True

    def leaveRoom(self, identity):
        res = self.__dbSystem.select_from('Player', ['room', 'roomAdmin'], conditions={'identity': identity})

        room = None
        asAdmin = False
        if len(res) > 0:
            room = res[0][0]
            asAdmin = (False if res[0][1] == None else res[0][1])

        if room != None:
            self.__dbSystem.update('Player', {'room': None, 'roomAdmin': None}, {'identity': identity})

            res = self.__dbSystem.select_from('Player', ['room'], conditions={'room': room})
            if len(res) == 0:
                self.__dbSystem.delete_from('Rooms', conditions={'name': room})

            else:
                if asAdmin == True:
                    res = self.__dbSystem.select_from('Player', ['identity'], conditions={'room': room})

                    if len(res) > 0:
                        self.__dbSystem.update('Player', {'roomAdmin': True}, conditions={'identity': res[0][0]})
