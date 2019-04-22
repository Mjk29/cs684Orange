const chalk = require('chalk');
const { exec } = require('child_process');
var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')

global.nextServer = 0
global.maxServer = process.argv[3]
global.serverList = []

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
	app.use(bodyParser.json())

main()

function main() {
	switch(process.argv[2]){
		case "?":
			displayHelp()
			break

		case "-kill":
			checkCurrentProcesses()
				.then((data) => {
					killProcesses(formatPgrep(data))
			})
			break

		case "-list":
			checkCurrentProcesses()
			.then((data) => {
				console.log(formatPgrep(data))
			})
			break

		case "-start":
			startNodeServers()
			listenForConnections()
			break

		case "-npmL":
			checkCurrentProcessesNPM()
			.then((data) => {
				console.log(npmParse(data))
			})
			break
		case "-npmStart":
			startNPMServer2() 
			break
		
		default:
			displayHelp()
			break
	}
}

function startNPMServer2() {
	const express = require('express');
	const path = require('path');
	const npmApp = express();

	console.log(__dirname)


	// npmApp.use(express.static(path.join(__dirname, 'build')));

	// npmApp.get('/', function(req, res) {
	// 	res.sendFile(path.join(__dirname, 'build', 'index.html'));
	// });

	// npmApp.listen(9000);
}















function startNPMServers() {
	// if (process.argv[3] === undefined){
	// 	console.log(chalk.cyanBright("    -start n\n        starts n nodeServer.js processes"))
	// 		return
	// }
	const startList = []
	startPort = 5581
	for (let i = 0; i < 5; i++) {
		startList.push(() => startSlaveNPM([{prefix:"PORT="+(startPort+i), command: "npm start"}]))
	}
	console.log(startList)
	const arrayOfPromises = startList.map(task => task())
	Promise.all(arrayOfPromises)
	.then((failedToStart) =>{
		console.log(failedToStart)
	})
	// run(startList)
}



function startSlaveNPM(sL) {
	var unavailablePorts = []
	return new Promise(resolve =>{
		for (var i = 0; i < sL.length; i++) {
			exec(sL[i].prefix+" "+sL[i].command, (err, cmdOutput, stderr) => {
				if (err) {
					console.log(err)
					let m;
					const regex = /Error: listen EADDRINUSE :::(.*)/gm;
					while ((m = regex.exec(err.message)) !== null) {
						if (m.index === regex.lastIndex) {
							regex.lastIndex++;
						}
						// console.log(chalk.red(`${m[1]}`))
						unavailablePorts.push(m[1])
					}
					resolve(unavailablePorts)
				}
				else{
					console.log(cmdOutput)
				}
			});
		}
	})
}









function npmParse(cliString) {
	var parsedArray = []
	var outputArray = cliString.output.split("\n")
	for (var i = 0; i < outputArray.length; i++) {
		let parsedLine = outputArray[i].split(/\s+/)
		if (parsedLine[0] == "tcp") {
			let m
			let line={}
			const regex = /\d*.\d*.\d*.\d:(.*)/gm;
			while ((m = regex.exec(parsedLine[3])) !== null) {
				if (m.index === regex.lastIndex) {
					regex.lastIndex++;
				}
				line["port"]=m[1]
				let splitName = parsedLine[6].split("/")
				line["pid"]=splitName[0]
				line["cmd"]=splitName[1]
			}
			parsedArray.push(line)
		}
	}
	return parsedArray
}

function checkCurrentProcessesNPM() {
	return new Promise(resolve =>{
		var parsedArray = []
		exec('netstat -lntp | grep "node"', (err, cmdOutput, stderr) => {
			if (err){	resolve({error:err})		}
			else	{	resolve({output:cmdOutput})	}
		});
	})
}

function listenForConnections() {
	http.listen(5680, function(){
		console.log(chalk.rgb(33, 255, 0).bold.bgRgb(0, 25, 66)('    listening on 5680    '))
	});
	app.get('/', function (req, res) {
		res.redirect('http://afsconnect1.njit.edu:5000/?'+serverList[nextServer++]["port"]);
		if (nextServer >= maxServer) {nextServer = 0}
	})
}

function startNodeServers() {
	if (process.argv[3] === undefined){
		console.log(chalk.cyanBright("    -start n\n        starts n nodeServer.js processes"))
			return
	}
	const startList = []
	startPort = 5681
	for (let i = 0; i < process.argv[3]; i++) {
		startList.push(() => startSlaveNode([{command:"node", file: "nodeServer.js", args:startPort+i}]))
	}
	const arrayOfPromises = startList.map(task => task())
	Promise.all(arrayOfPromises)
	.then((failedToStart) =>{
		console.log(failedToStart)
	})
	run(startList)
}


function displayHelp() {
	console.log(chalk.cyanBright("    Help menu:"))
	console.log(chalk.cyanBright("        -start n\n            starts n nodeServer.js processes"))
	console.log(chalk.cyanBright("        -list\n            lists all running nodeServer processes"))
	console.log(chalk.cyanBright("        -kill\n            kills all running nodeServer processes\n"))
}


function run(startList) {
	var minutes = 5
	var portHash = {}
	for (var i = 0; i < startList.length; i++) {
		portHash[startList[i].args] = 0
	}
	var the_interval = minutes * 60 * 1000;
	setInterval(function() {
		for(var pH in portHash){
			portHash[pH] = 0
		}
		checkCurrentProcesses()
		.then((data) => {
			serverList = formatPgrep(data)
			console.log(serverList)
			for (var i = 0; i < serverList.length; i++) {
				portHash[serverList[i].port] = 1
			}
			var restartList = []
			for(var pH in portHash){
				if(portHash[pH] == 0){
					restartList.push({command:"node", file: "nodeServer.js", args:pH})
				}
			}
			startSlaveNode(restartList)
		})
	}, 5000);
}

function checkCurrentProcesses() {
	return new Promise(resolve =>{
		var parsedArray = []
		exec('pgrep -u mjk29 -f nodeServer.js -a', (err, cmdOutput, stderr) => {
			if (err){	resolve({error:err})		}
			else	{	resolve({output:cmdOutput})	}
		});
	})
}

function formatPgrep(rawPgrep) {
	var parsedArray = []
	var outputArray = rawPgrep.output.split("\n")
	for (var i = 0; i < outputArray.length; i++) {
		let parsedLine = outputArray[i].split(" ")
		if (parsedLine[2] == 'nodeMasterServer.js' || parsedLine[2] === undefined ) {continue}
		let parsedLineObj = {}
		parsedLineObj["pid"] = parsedLine[0]
		parsedLineObj["cmd"] = parsedLine[1]
		parsedLineObj["file"] = parsedLine[2]
		parsedLineObj["port"] = parsedLine[3]
		parsedArray.push(parsedLineObj)
	}
	return parsedArray
}

function killProcesses(parsedArray) {
	for (var i = 0; i < parsedArray.length; i++) {
		exec('kill '+ parsedArray[i].pid, (err, out, stderr) => {
			if (err) {
				console.error(`exec error: ${err}`);
				return;
			}
		})
	}
}

function startSlaveNode(sL) {
	var unavailablePorts = []
	return new Promise(resolve =>{
		for (var i = 0; i < sL.length; i++) {
			exec(sL[i].command+" "+sL[i].file+" "+sL[i].args, (err, cmdOutput, stderr) => {
				if (err) {
					let m;
					const regex = /Error: listen EADDRINUSE :::(.*)/gm;
					while ((m = regex.exec(err.message)) !== null) {
						if (m.index === regex.lastIndex) {
							regex.lastIndex++;
						}
						// console.log(chalk.red(`${m[1]}`))
						unavailablePorts.push(m[1])
					}
					resolve(unavailablePorts)
				}
			});
		}
	})
}



