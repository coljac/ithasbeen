from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from tinydb import Query
from database import Database
# from pydantic import BaseModel
# from typing import Union
from datetime import datetime
from model import Board
import string
import random

# Setup
app = FastAPI()
database = Database("/tmp/board.json")
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# TODO
# Better error handling
# "New" button
# Header and footer
# Nicer styles
# Word wrap
# Deployment, firebase etc
# Random board at front
# Copy links

origins = [
    "http://localhost",
    "http://localhost:5174",
    "http://localhost:5175",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Paths/api
dformat = "%Y-%m-%d"

def ds(datet=None):
    if datet is None:
        datet = datetime.now().date()
    return datet.strftime(dformat)

def sd(s):
    return datetime.strptime(s, dformat).date()

def days_since(checkpoint):
    checkpoint_date = sd(checkpoint)
    today = datetime.now().date()
    delta = today - checkpoint_date
    return delta.days



@app.get("/board/{board_id}")
async def read_board(board_id:str):
    boards = Query()
    res = None
    with database as db:
        result = db.search(boards.id == board_id)
        if len(result) > 0:
            result[0]['editkey'] = ""
            res = result[0]
        else:
            result = db.search(boards.editkey == board_id)
            if len(result) > 0:
                res = result[0]
    if res is None:
        return {'error': 'board not found', 'days': 0, 'happening': "(error)"}
    res = res.copy()
    if res['auto']:
        try:
            print(f"{res['days']} after {res['checkpoint']} given it is {ds()} is {days_since(res['checkpoint']) + res['days']}")
            # print(res['checkpoint'])
            # print(res['checkpoint'])
            res['days'] = days_since(res['checkpoint']) + res['days']
        except Exception as e:
            pass
            # raise e
    return res

# @app.get("/boards/")
# async def read_boards(skip: int = 0, limit: int = 10):
    # with database as db:
        # return db.all()[skip:skip+limit]

@app.put("/setcount/{board_id}")
async def reset_board(days: int=0, id: str="", editkey: str=""):
    return create_edit_board(days=days, id=id, editkey=editkey)

def generate_id(length=5):
    return ''.join(random.choice(string.ascii_letters + string.digits) for i in range(length))

@app.put("/board/{id}")
# async def create_edit_board(id: str="", happening:str="", 
    # days: int=0, auto: bool=False, editkey:str = ""):
async def create_edit_board(inboard: Board):
    print(inboard, "<<<<")
    result = {}
    with database as db:
        BQ = Query()
        id = inboard.id
        inboard.checkpoint = ds()
        # try:
        #    print(">>>>", id)
        # except:
            # print("no")
            # id = ""
        if len(id) == 0 or id=="new":
            id = generate_id()
            editkey = generate_id()
            board = inboard
            board.id = id
            board.editkey = editkey
            # Board(id=id, editkey=editkey,
            # auto=auto, happening=happening, days=days)
            res = db.insert(board.dict())
            print(res)
            result['status'] = 'OK'
            result['board'] = board.dict()
        else:
            try:
                board = db.get(BQ.id == id)
            except:
                result['status'] = 'error'
                result['message'] = "Incorrect board id."
                return result
            if board['editkey'] == inboard.editkey:
                db.update(inboard, doc_ids=[board.doc_id])
                result['status'] = "OK"
                result['board'] = inboard.dict()
            else:
                result['status'] = "error"
                result['message'] = "You didn't have the correct key to edit this board."
        return result