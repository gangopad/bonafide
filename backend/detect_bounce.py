from __future__ import print_function

from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools
import base64
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import mimetypes
import os
import sys
from pymongo import MongoClient
import datetime


# If modifying these scopes, delete the file token.json.
#SCOPES = 'https://www.googleapis.com/auth/gmail.readonly'
SCOPES = 'https://mail.google.com/' 


def GetMessage(service, user_id, msg_id, db):
  """Get a Message with given ID.

  Args:
    service: Authorized Gmail API service instance.
    user_id: User's email address. The special value "me"
    can be used to indicate the authenticated user.
    msg_id: The ID of the Message required.

  Returns:
    A Message.
  """
  try:
    message = service.users().messages().get(userId=user_id, id=msg_id).execute()
    payload = message['payload']
    #print('\n\n\nMessage snippet: %s' % message['snippet'])
    headers = payload['headers']

    detectBounce(payload, db)

  except errors.HttpError, error:
    print('An error occurred: %s' % error)


def ListMessagesMatchingQuery(service, user_id, query, db):
  """List all Messages of the user's mailbox matching the query.

  Args:
    service: Authorized Gmail API service instance.
    user_id: User's email address. The special value "me"
    can be used to indicate the authenticated user.
    query: String used to filter messages returned.
    Eg.- 'from:user@some_domain.com' for Messages from a particular sender.

  Returns:
    List of Messages that match the criteria of the query. Note that the
    returned list contains Message IDs, you must use get with the
    appropriate ID to get the details of a Message.
  """
  try:
    response = service.users().messages().list(userId=user_id,
                                               q=query).execute()
    messages = []
    if 'messages' in response:
      messages.extend(response['messages'])

    while 'nextPageToken' in response:
      page_token = response['nextPageToken']
      response = service.users().messages().list(userId=user_id, q=query,
                                         pageToken=page_token).execute()
      messages.extend(response['messages'])

    for message in messages:
      threadId = message["threadId"]
      GetMessage(service, "info@yourbonafide.com", threadId, db)

  except errors.HttpError, error:
    print('An error occurred: %s' % error)




#pulls all email from that day
def getEmail(end, db):
	store = file.Storage('token.json')
  	creds = store.get()
  	user_id = "info@yourbonafide.com"
  	#query = "in:sent after:2014/01/01 before:2014/02/01"
  	query = "in:inbox after:" + end

  	if not creds or creds.invalid:
          flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
          creds = tools.run_flow(flow, store)

  	service = build('gmail', 'v1', http=creds.authorize(Http()))

  	ListMessagesMatchingQuery(service, user_id, query, db)



#parse emails and pull email addresses that bounced
def detectBounce(payload, db):
  headers = payload['headers']
  for header in headers:
      if header['value'] == 'Bonafide is changing the take-out delivery game':
        updateDB(payload, db)
        return





#updates mongo by adding the flag bounced
def updateDB(payload, db):
  headers = payload['headers']
  for header in headers:
    if header['name'] == 'to':
      email = header['value']
      newvalues = { "$set": { "blacklisted": "True" } }
      db.users.update({"email": email}, newvalues)
      #print(email)


if __name__ == '__main__':

  if len(sys.argv) < 2:
    print "python detect_bounce.py start"

  end = datetime.datetime.today().strftime('%Y/%m/%d')
  client = MongoClient()
  db = client.bonafide
  getEmail(end, db)


