class Singleton():
    def __init__(self, singleton_class):
        self.singleton_class = singleton_class
        self.instance = None

    def __call__(self, *args, **kwds):
        if self.instance == None:
            self.instance = self.singleton_class(*args, **kwds)
        return self.instance
