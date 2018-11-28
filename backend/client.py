"""
Test file for the backend route
"""

import json
import requests

def postData():
	url = "http://localhost:7550/data"
	body = dict()

	body["email"] = "test email"
	body["referrer_token"] = "test-token"
	body["ip"] = "test_ip"

	payload = json.dumps(body)
	#headers={'Accept': 'application/json', 'Content-Type': 'application/json'}
	headers = {}

        #post data to insert in backend
	r = requests.post(url, headers=headers, data=payload)
	print r.status_code


if __name__ == "__main__":
	postData()
