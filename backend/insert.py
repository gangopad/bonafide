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

from bs4 import BeautifulSoup
import codecs
import math
import nltk
import os
import re
import string
import numpy as np
import requests
from pymongo import MongoClient
import json


#checks whether there has been a signup on this IP with a different email and/or another signup with the same email
def checkIP(IP, email):
	return false


def updateReferrer(is_valid, token):
	if is_valid == False:
		return 

	#update referrer via mongo query (ie get the referral then update it)


if __name__ == "__main__":

	if len(sys.argv) < 2:
		print "Run as python insert.py [data]"
		sys.exit(-1)

	data = sys.argv[1]
	print data

	data = json.loads(data)
	is_valid = checkIP(data["IP"], data["email"])
	updateReferrer(is_valid, data["token"])
	updateUser(data["email"], data["IP"])
	sendEmail(data["email;"]) #The automated email we send them should have a link to their success page

	client = MongoClient()
    db = client.bonafide