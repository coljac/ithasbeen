import sys
from database import Database
from model import Board
    
def main(argv):

    database = Database(argv[0])

    with database as db:
        db.truncate()
        db.insert(
            Board(id="abcde", happening="I learned React properly.", days=3, editkey="12345", auto=True,
            checkpoint="2022-10-20").dict()
        )
        db.insert(
            Board(id="abcde", happening="Russia told a lie.", days=0, editkey="12345").dict()
        )
        # db.insert({'id': "abcde", 'happening': 'I learned React', 'days': 3, 'editkey': "12345"})
        # db.insert({'id': "cdefg", 'happening': 'Russia told a lie', 'days': 0, 'editkey': "12345"})
        # table = db.table("users")
        # table.insert({'id': 1, 'name': 'coljac', 'password': 'hello', 'role': 'admin'})
        # table.insert({'id': 2, 'name': 'dave', 'password': 'hello', 'role': 'user'})

if __name__=="__main__":
    main(sys.argv[1:])
