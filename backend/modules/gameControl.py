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

    def stop(self):
        if self.__running != True:
            return

        self.__dbSystem.close_connection()

        self.__running = False
