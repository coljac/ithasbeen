import sys
from mongodb import Database
from model import Board
    
def main():

    database = Database()

    with database as db:
        db = db['boards']
        db.drop()
        db.insert_many([
            Board(id="abcde", happening="I learned React properly.", days=3, editkey="12345", auto=True,
            checkpoint="2022-10-20").dict(),
            Board(id="cdefg", happening="Russia told a lie.", days=0, editkey="23456").dict()
        ])
        # db.insert({'id': "abcde", 'happening': 'I learned React', 'days': 3, 'editkey': "12345"})
        # db.insert({'id': "cdefg", 'happening': 'Russia told a lie', 'days': 0, 'editkey': "12345"})
        # table = db.table("users")
        # table.insert({'id': 1, 'name': 'coljac', 'password': 'hello', 'role': 'admin'})
        # table.insert({'id': 2, 'name': 'dave', 'password': 'hello', 'role': 'user'})

if __name__=="__main__":
    main()
