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

# If modifying these scopes, delete the file token.json.
#SCOPES = 'https://www.googleapis.com/auth/gmail.readonly'
SCOPES = 'https://mail.google.com/' 

def SendMessage(user_id, message):
  """Send an email message.

  Args:
    service: Authorized Gmail API service instance.
    user_id: User's email address. The special value "me"
    can be used to indicate the authenticated user.
    message: Message to be sent.

  Returns:
    Sent Message.
  """
  store = file.Storage('token.json')
  creds = store.get()
  if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
        creds = tools.run_flow(flow, store)
  service = build('gmail', 'v1', http=creds.authorize(Http()))

  try:
    message = (service.users().messages().send(userId=user_id, body=message)
               .execute())
    print('Message Id: %s' % message['id'])
    return message
  except errors.HttpError, error:
    print('An error occurred: %s' % error)


def CreateMessage(sender, to, subject, message_text):
  """Create a message for an email.

  Args:
    sender: Email address of the sender.
    to: Email address of the receiver.
    subject: The subject of the email message.
    message_text: The text of the email message.

  Returns:
    An object containing a base64url encoded email object.
  """
  message = MIMEText(message_text, 'html')
  message['to'] = to
  message['from'] = sender
  message['subject'] = subject
  return {'raw': base64.urlsafe_b64encode(message.as_string())}


def getLabels():
    """Shows basic usage of the Gmail API.
    Lists the user's Gmail labels.
    """
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    store = file.Storage('token.json')
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
        creds = tools.run_flow(flow, store)
    service = build('gmail', 'v1', http=creds.authorize(Http()))

    # Call the Gmail API
    results = service.users().labels().list(userId='me').execute()
    labels = results.get('labels', [])

    if not labels:
        print('No labels found.')
    else:
        print('Labels:')
        for label in labels:
            print(label['name'])

if __name__ == '__main__':

  #getLabels()
  with open("email.txt") as f:
    metadata = f.read().strip()

  metadata = metadata.split("\n")
  email = metadata[0].strip()
  referral_link = metadata[1].strip()
  success_link = metadata[2].strip()


  subject = "Bonafide is changing the take-out delivery game"
  content = """Hi There,<br><br>

Thank you! You've been added to the Bonafide e-mail list. We will keep you up-to-date with any news and will be sure to let you know when we are launching in your city.<br><br>

<strong>Interested in free meals?</strong><br>
Get free meals by referring your friends. The more friends that join, the more free meals and discounts that you'll earn. Just share this link: """ + referral_link + """<br><br>

You can check your progress towards your free meals """ + success_link + """.<br><br>

Sincerely,<br>
The Bonafide Team<br>
https://www.yourbonafide.com"""

    
  message = CreateMessage("Bonafide - Authentic Home Cooked Food <info@yourbonafide.com>", email, subject, content)
  SendMessage("info@yourbonafide.com", message)

