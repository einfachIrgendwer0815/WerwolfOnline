from modules import db
from sqlIntuitive.conditionEnums import ComparisonTypes

import threading
import time
from datetime import datetime, timezone

class DBWatchdog():
    def __init__(self):
        self.thread = WatchdogThread()

    def start(self):
        self.thread.start()

    def stop(self):
        self.thread.stop()

class WatchdogThread(threading.Thread):
    def __init__(self):
        super().__init__()

        self._doRun_ = True

    def stop(self):
        self._doRun_ = False

    def run(self):
        while self._doRun_:
            dbSystem = db.create_mysql_db_system()
            dbSystem.connect_to_db()
            dbSystem.create_cursor()

            timestamp = int(datetime.timestamp(datetime.now(timezone.utc)))
            dbSystem.delete_from("Player",{'expireTimestamp': {'value': timestamp, 'comparison': ComparisonTypes.LESS_THAN_OR_EQUAL_TO}})

            dbSystem.close_connection()

            time.sleep(60)

if __name__ == "__main__":
    DBWatchdog().start()
else:
    raise RuntimeError("DBWatchdog can only be used as standalone process.")
