import threading
from pymongo import MongoClient
import os

class Database(object):
    _instance = None
    _lock = threading.Lock()
    _db = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
          with cls._lock:
            if not cls._instance:
              cls._instance = super(Database, cls).__new__(cls)
              userpass = os.environ.get("MONGO_DB_CREDS", None)
              if userpass is None:
                userpass = kwargs['creds']
              cls._db = MongoClient(f"mongodb+srv://{userpass}@hasbeen.yg8y4iu.mongodb.net/?retryWrites=true&w=majority")['boards']
        return cls._instance

    def __enter__(self):
        self._lock.acquire()
        return self._db

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._lock.release()
