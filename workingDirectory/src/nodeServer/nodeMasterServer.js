var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var itemTableName = "684Items"
var cartTableName = "684Cart"
const chalk = require('chalk');

const { exec } = require('child_process');

main()




function main() {
	switch(process.argv[2]){
		case "?":
			console.log(chalk.cyanBright("    Help menu:"))
			console.log(chalk.cyanBright("        -start n"))
			console.log(chalk.cyanBright("            starts n nodeServer.js processes"))
			console.log(chalk.cyanBright("        -list"))
			console.log(chalk.cyanBright("            lists all running nodeServer processes"))
			console.log(chalk.cyanBright("        -kill"))
			console.log(chalk.cyanBright("            kills all running nodeServer processes\n"))

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
			if (process.argv[3] === undefined){
				console.log(chalk.cyanBright("    -start n"))
				console.log(chalk.cyanBright("        starts n nodeServer.js processes"))
				return
			}
			startList = []
			startPort = 5680
			for (var i = 0; i < process.argv[3]; i++) {
				startList.push({command:"node", file: "nodeServer.js", args:startPort+i})
			}
			startSlaveNode(startList)
			run(startList)
	}
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
	}, the_interval);
}




function checkCurrentProcesses() {
	return new Promise(resolve =>{
		var parsedArray = []
		exec('pgrep -u mjk29 -x node  -a', (err, cmdOutput, stderr) => {
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
	for (var i = 0; i < sL.length; i++) {
		exec(sL[i].command+" "+sL[i].file+" "+sL[i].args, (err, cmdOutput, stderr) => {
			if (err) {
				let m;
				const regex = /Error: listen EADDRINUSE :::(.*)/gm;
				while ((m = regex.exec(err.message)) !== null) {
					if (m.index === regex.lastIndex) {
						regex.lastIndex++;
					}
					console.log(chalk.red(`${m[0]}`))
				}
				return;
			}
		});
	}
}



