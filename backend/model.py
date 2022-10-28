import bcrypt
from pydantic import BaseModel
from typing import Union

class User(BaseModel):
    username: str
    email: Union[str, None] = None
    hashedpw: str
    apitoken: Union[str, None] = None

class Board(BaseModel):
    id: str = ""
    days: int = 0
    happening: str = "default"
    editkey: str = ""
    checkpoint: str = ""
    auto: bool = False
    # history: str = ""