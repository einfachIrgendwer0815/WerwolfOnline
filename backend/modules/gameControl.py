from modules import db
from modules import functions

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
        self.__dbSystem.create_table('Rooms', {'name': 'varchar(10)', 'game': 'varchar(10)', 'public': 'boolean', 'playerLimit': 'int', 'persistant': 'boolean'}, primaryKeys=['name'], foreignKeys={'game': 'Games(name)'})
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
        self.leaveRoom(identity)
        self.__dbSystem.delete_from('Player', {'identity': identity})

    def updatePlayerExpireTimestamp(self, identity, newExpire):
        self.__dbSystem.update('Player', {'expireTimestamp': newExpire}, {'identity': identity})

    def getPlayerNickname(self, identity):
        res = self.__dbSystem.select_from('Player', ['nickname'], {'identity': identity})

        if len(res) > 0 and res[0][0] != None:
            return res[0][0]
        else:
            return None

    def getVolumeSetting(self, identity):
        res = self.__dbSystem.select_from('Player', ['volumeSetting'], {'identity': identity})

        if len(res) > 0 and res[0][0] != None:
            return res[0][0]
        else:
            return None

    def setPlayerNickname(self, identity, nickname):
        self.__dbSystem.update('Player', {'nickname': nickname}, {'identity': identity})

    def setVolumeSetting(self, identity, volume):
        self.__dbSystem.update('Player', {'volumeSetting': volume}, {'identity': identity})

    def isPlayerInRoom(self, identity):
        res = self.__dbSystem.select_from('Player', ['room'], {'identity': identity})

        if len(res) > 0 and res[0][0] != None:
            return True
        else:
            return False

    def createRoom(self, name=None, public=False, playerLimit=10, maxRetries=5, retryNo=0):
        name = (name if name != None else functions.generateName())
        res = self.__dbSystem.select_from('Rooms', ['name'], {'name': name})

        if len(res) == 0:
            self.__dbSystem.insert_into('Rooms', {'name': name, 'public': public, 'playerLimit': playerLimit})
            return True, name

        if retryNo >= maxRetries:
            return False, None
        else:
            return self.createRoom(retryNo=retryNo+1)

    def joinRoom(self, identity, roomName=None, roomIsPublic=None, roomPlayerLimit=10):
        asAdmin = False
        if roomName == None:
            success, roomName = self.createRoom(public=(False if roomIsPublic == None else roomIsPublic), playerLimit=(10 if roomPlayerLimit == None else roomPlayerLimit))
            if success == False:
                return False

            asAdmin = True

        else:
            res = self.__dbSystem.select_from('Rooms', ['name', 'playerLimit'], {'name': roomName})

            if len(res) == 0:
                success, roomName = self.createRoom(name=roomName, public=(False if roomIsPublic == None else roomIsPublic), playerLimit=(10 if roomPlayerLimit == None else roomPlayerLimit))
                if success == False:
                    return False

                asAdmin = True

        res = self.__dbSystem.select_from('Player', ['room'], {'identity': identity})

        if len(res) >= 0 and res[0][0] != None:
            if res[0][0] != roomName:
                self.leaveRoom(identity)
        elif len(res) == 0:
            return False

        res = self.__dbSystem.select_count('Player', 'room', {'room': roomName})
        res2 = self.__dbSystem.select_from('Rooms', ['playerLimit'], {'name': roomName})

        if res == None or len(res2) == 0 or res < res2[0][0]:
            self.__dbSystem.update('Player', {'room': roomName, 'roomAdmin': asAdmin}, {'identity': identity})

            return True

        return False

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
                res = self.__dbSystem.select_from('Rooms', ['persistant'], conditions={'name': room})

                if len(res) == 0 or res[0][0] != True:
                    self.__dbSystem.delete_from('Rooms', conditions={'name': room})

            else:
                if asAdmin == True:
                    res = self.__dbSystem.select_from('Player', ['identity'], conditions={'room': room})

                    if len(res) > 0:
                        self.__dbSystem.update('Player', {'roomAdmin': True}, conditions={'identity': res[0][0]})

    def getRoomCode(self, identity):
        res = self.__dbSystem.select_from('Player', ['room'], conditions={'identity': identity})

        if len(res) == 0 or res[0][0] == None:
            return None

        return res[0][0]

    def getRoomMembers(self, identity):
        room = self.getRoomCode(identity)
        if room == None:
            return []

        res = self.__dbSystem.select_from('Player', ['nickname'], conditions={'room': room})

        if len(res) == 0:
            return []

        return [i[0] for i in res]

    def isRoomPublic(self, identity):
        room = self.getRoomCode(identity)
        if room == None:
            return None

        res = self.__dbSystem.select_from('Rooms', ['public'], conditions={'name': room})

        if len(res) == 0:
            return None

        return bool(res[0][0])

    def getRoomPlayerLimit(self, identity):
        room = self.getRoomCode(identity)
        if room == None:
            return None

        res = self.__dbSystem.select_from('Rooms', ['playerLimit'], conditions={'name': room})

        if len(res) == 0:
            return None

        return res[0][0]

    def getPublicRooms(self):
        res = self.__dbSystem.select_from('Rooms', ['name', 'playerLimit'], conditions={'public': True})

        rooms = []

        for room in res:
            res2 = self.__dbSystem.select_count('Player', 'room', {'room': room[0]})

            if res2 < room[1]:
                rooms.append((room[0], res2, room[1]))

        return rooms
