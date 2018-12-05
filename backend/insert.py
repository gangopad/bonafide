# -*- coding: utf-8 -*-                                                   

"""
In this file, we receive data once the "claim spot" button is clicked. We:
1) Update the referrals number for the user with the given token (ie the referrer)
2) Store the new email, IP, geo (we infer this), token (generate this) in users collection
3) Ban the user in some way if they sign up more than once with the same email or from the same IP
4) send automated email to user 
"""

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

import os
import re
import string
#import requests
from pymongo import MongoClient
import json
import uuid

"""
from __future__ import print_function
import httplib2
import os

from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
import base64
from apiclient import errors
import time
"""
import yaml


# If modifying these scopes, delete your previously saved credentials
# at ~/.credentials/gmail-python-quickstart.json
SCOPES = 'https://www.googleapis.com/auth/gmail.modify'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Bonafide'


#checks whether there has been a signup on this IP with a different email and/or another signup with the same email
def checkIP(IP, email):
	res = db.users.find({"email": email})

	if res.count() > 0:
		return False

	return True


#updates the referrer's number
def updateReferrer(is_valid, referrer_token, db):
	if is_valid is False:
		return 

	#update referrer via mongo query (ie get the referral then update it)
	res = db.users.find({"token":referrer_token})
	email = ""
	referrals = 0

	for user in res:
		email = user["email"]
		referrals = user["referrals"]


	#update 
	referrals = int(referrals) + 1
	myquery = { "email": email }
	newvalues = { "$set": { "referrals": referrals } }

	db.users.update_one(myquery, newvalues)



#adds user to the database if they are a new user.  
def updateUser(is_valid, data, db):
	if is_valid is False:
		return

	email = data["email"]
	token = ""
	referrals = 0

	res = db.users.find({"email":email})
	num_users = res.count()

	if num_users > 0:
		return False



	payload = dict()
	token = str(uuid.uuid4())

	#ip_data = json.loads(data["ip"])
	ip_data = yaml.safe_load(data["ip"])

	
	payload["email"] = email
	payload["IP"] = ip_data["geobytesipaddress"]
	payload["geobytesregionlocationcode"] = ip_data["geobytesregionlocationcode"]
	payload["latitude"] = ip_data["geobyteslatitude"]
	payload["longitude"] = ip_data["geobyteslatitude"]
	payload["referrals"] = 0
	payload["token"] = token
	db["users"].insert(payload)
	
	print("Inserted the following payload: " + str(payload))

	return True



#sends user 
def sendEmail(email, is_valid, send_email):
	if is_valid is False or send_email is False:
		return 

	#send an email on behalf of info@getbonafide.com to user


if __name__ == "__main__":

	if len(sys.argv) < 2:
		print("Run as python insert.py [data]")
		sys.exit(-1)

	data = sys.argv[1]
	client = MongoClient()
	db = client.bonafide

	#data = json.loads(data)
	data = yaml.safe_load(data)
	is_valid = checkIP(data["ip"], data["email"])
	updateReferrer(is_valid, data["referrer_token"], db)
	send_email = updateUser(is_valid, data, db)
	sendEmail(data["email"], is_valid, send_email) #The automated email we send them should have a link to their success page
