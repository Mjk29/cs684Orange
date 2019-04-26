const chalk = require('chalk');
const { exec } = require('child_process');
var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')


main()

function main() {
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	app.use(bodyParser.json())

	http.listen(process.argv[2]);


	app.post('/', function (req, res) {
		
		let postRequest = {
			origin: req.headers.origin,
			requestType: req.body.searchType,
			query: req.body.query,
			serverTime: Date.now(),
			timer:req.body.timer,
			userEmail:req.body.userEmail

		}

		console.log(postRequest)
		console.log("")

	})

}



