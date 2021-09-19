class DBWatchdog():
    def start(self):
        pass

if __name__ == "__main__":
    DBWatchdog().start()
else:
    raise RuntimeError("DBWatchdog can only be used as standalone process.")
