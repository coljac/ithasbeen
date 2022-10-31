#!/bin/bash

export MONGO_DB_CREDS=$(cat userpass.txt)
uvicorn main_mongo:app --reload
