var fs = require('fs');
var path = require( 'path' );
var process = require( "process" );

var appRouter = function(app, db, umls_db, assert, len) {

    app.get("/", function(req, res) {
	    var accountMock = {
		"username": "nraboy",
		"password": "1234",
		"twitter": "@nraboy"
	    }
	    if(!req.query.username) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader('Content-Type', 'application/json');
		return res.send({ "records":[ {"Name":"Alfreds Futterkiste","City":"Berlin","Country":"Germany"}, {"Name":"Ana Trujillo Emparedados y helados","City":"México D.F.","Country":"Mexico"}, {"Name":"Antonio Moreno Taquería","City":"México D.F.","Country":"Mexico"}, {"Name":"Around the Horn","City":"London","Country":"UK"}, {"Name":"B's Beverages","City":"London","Country":"UK"}, {"Name":"Berglunds snabbköp","City":"Luleå","Country":"Sweden"}, {"Name":"Blauer See Delikatessen","City":"Mannheim","Country":"Germany"}, {"Name":"Blondel père et fils","City":"Strasbourg","Country":"France"}, {"Name":"Bólido Comidas preparadas","City":"Madrid","Country":"Spain"}, {"Name":"Bon app'","City":"Marseille","Country":"France"}, {"Name":"Bottom-Dollar Marketse","City":"Tsawassen","Country":"Canada"}, {"Name":"Cactus Comidas para llevar","City":"Buenos Aires","Country":"Argentina"}, {"Name":"Centro comercial Moctezuma","City":"México D.F.","Country":"Mexico"}, {"Name":"Chop-suey Chinese","City":"Bern","Country":"Switzerland"}, {"Name":"Comércio Mineiro","City":"São Paulo","Country":"Brazil"} ] });
		//return res.send({"status": "error", "message": "missing username"});
		//return res.jsonp({status: 'error', message: 'missing username'});
	    } else if(req.query.username != accountMock.username) {
		return res.send({"status": "error", "message": "wrong username"});
		//return res.jsonp({"status": "error", "message": "wrong username"});
	    } else {
		return res.send(accountMock);
	    }
	});



    app.post("/data", function(req, res) {
    	var credentials = "Basic cGF1bC5ncmFkeUBjbHNkcy5jb206Z3JzMm1nViQoZFIkMytASw==";
    	res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


    	if (!req.body.email || !req.body.referrer_token || !req.body.ip) {
    		console.log(req.body);
			return res.send({"status": "error", "message": "missing parameters"});

	    } else {
	    	insertUsers(db, "users", JSON.stringify(req.body), function(data) {
	    		res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader('Content-Type', 'application/json');
				return res.sendStatus(200);
	    	});
	   
	    	//console.log(JSON.stringify(req.body));

			return res.sendStatus(200);

	    }

    });



    /* Updates the waiting list (put auth in later) */
    app.get("/UpdateWaitingList", function(req, res) {
    	var query = {"type" : "total_users"};
    	var fields = {"value": 1};

    	getUsers(db, function(data) {
    		var users = parseInt(data["value"]);
    		users = users + 1;
    		db.collection("statistics").update({"type": "total_users"}, { $set : {"value": users}});
	    	res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
			return res.sendStatus(200);
	   	});

	});


    /* Retrieves the waiting list (put auth in later)*/
    app.get("/getWaitingList", function(req, res) {
    	var query = {"type" : "total_users"};
    	var fields = {"value": 1};

    	getUsers(db, function(data) {
    		res.setHeader('Content-Type', 'text/plain');
            res.setHeader("Access-Control-Allow-Origin", "*");
            return res.send(data);
	   	});

	});


    /* Retrieves the number of referrals and token given username */
    app.get("/getMetadata", function(req, res) {

	    if(!req.query.email) {
			return res.send({"status": "error", "message": "missing parameters! [email]"});
	    } else {
			var query = { "email": req.query.email};
			var fields = {"token": 1, "referrals": 1};
			var default_res = {"referrals": "None", "token": "None"};

			db.collection("users").find(query, fields).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.setHeader("Access-Control-Allow-Origin", "*");

                if (result.length > 0) {
                	return res.send(JSON.stringify(result[0]));
                } else {
                	return res.send(JSON.stringify(default_res));
                }
                
            });
	    }
	});


	/* Retrieves the number of referrals and email given token */
    app.get("/getTokenMetadata", function(req, res) {

	    if(!req.query.token) {
			return res.send({"status": "error", "message": "missing parameters! [token]"});
	    } else {
			var query = { "token": req.query.token};
			var fields = {"email": 1, "referrals": 1};
			var default_res = {"referrals": "None", "email": "None"};

			db.collection("users").find(query, fields).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.setHeader("Access-Control-Allow-Origin", "*");

                if (result.length > 0) {
                	return res.send(JSON.stringify(result[0]));
                } else {
                	return res.send(JSON.stringify(default_res));
                }
                
            });
	    }
	});

    
}

	/* returns the number of current users */
	var getUsers = function(db, callback) {
		var query = {"type" : "total_users"};
    	var fields = {"value": 1};

	    db.collection("statistics").find(query, fields).toArray(function(err, result) {
            if (err) throw err;
            callback(result[0]);
        });

	}


    /* inserts data into the databases either statistics or per user */
    var insertUsers = function(db, dbType, data, callback) {
		// Get the documents collection
		if (dbType == "statistics") {
            var collection = db.collection('statistics');
         } else {
            var collection = db.collection('users');

         }
		


	 	//we call the construct_query script in python
	 	var PythonShell = require('python-shell');

	 	var options = {
	     	mode: 'text',
	     	pythonPath: '//anaconda/bin/python',
	     	pythonOptions: ['-u'],
	     	scriptPath: '/Users/gangopad/Company/Bonafide/website/bonafide/backend',
	     	args: [data]
	 	};

	 	PythonShell.run('insert.py', options, function (err, script_output) {
			 if (err) throw err;
		 	console.log(script_output);
		});

    }

 
module.exports = appRouter;
