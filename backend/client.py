"""
Test file for the backend route
"""

import json
import requests



def testGeo():
	url = 'http://freegeoip.net/json/198.97.14.68'
	r = requests.get(url)
	print r.text
	#data = json.load(response.text)

	#IP=data['ip']
	#org=data['org']
	#city = data['city']
	#country=data['country']
	#region=data['region']

	#print 'Your IP detail\n '
	#print 'IP : {4} \nRegion : {1} \nCountry : {2} \nCity : {3} \nOrg : {0}'.format(org,region,country,city,IP)

def postData():
	url = "http://localhost:7550/data"
	body = dict()

	body["email"] = "test email"
	body["referrer_token"] = "test-token"
	body["ip"] = "test_ip"

	payload = json.dumps(body)
	headers={'Accept': 'application/json', 'Content-Type': 'application/json'}

        #post data to insert in backend
	r = requests.post(url, headers=headers, data=payload)
	print r.status_code
	print r.headers
	print r.text


if __name__ == "__main__":
	#postData()
	testGeo()
