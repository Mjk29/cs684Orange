const chalk = require('chalk');
const { exec } = require('child_process');
var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var table = require('table')
// var term = require( 'terminal-kit' ).terminal ;

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

	let startTime = 0
	switch(process.argv[2]){
		case "?":
			displayHelp()
			break

		case "-kill":
			checkCurrentProcesses("nodeServer.js")
				.then((data) => {
					killProcesses(formatPgrep(data))
			})
			break

		case "-list":
			checkCurrentProcesses("nodeServer.js")
			.then((data) => {
				displayTable(formatPgrep(data), "nodeServer.js")
			})
			break

		case "-start":
			startTime = checkUpdateArgs()
			startNodeServers("nodeServer.js", startTime)
			break

		case "-listNPM":
			checkCurrentProcesses("startNPMServer.js")
			.then((data) => {
				displayTable(formatPgrep(data), "startNPMServer.js")
			})
			break
		case "-startNPM":
			startTime = checkUpdateArgs()
			startNodeServers("startNPMServer.js", startTime) 
			break
		
		case "-run":
			startTime = checkUpdateArgs()
			startNodeServers("startNPMServer.js", startTime)
			startNodeServers("nodeServer.js", startTime)
			
			listenForConnections()
			break

		case "-test":
			testTable()
			break

		default:
			displayHelp()
			break
	}
}







function checkUpdateArgs() {
	let updateTimeArg = parseInt(process.argv[5], 10)
	if(Number.isInteger(updateTimeArg) && updateTimeArg >= 1){
		// console.log("good number" + updateTimeArg)
		return (updateTimeArg*1000)
	}
	else{
		console.log(chalk.redBright("unuseable update time : "+ updateTimeArg))
		console.log(chalk.redBright("defaulting to 30 "))
		return 30000
	}

}


function displayHelp() {
	console.log(chalk.cyanBright("    Help menu:"))
	console.log(chalk.cyanBright("        -run n\n            starts n nodeServer.js and n NPMServer processes"))
	console.log(chalk.cyanBright("        -start n\n            starts n nodeServer.js processes"))
	console.log(chalk.cyanBright("        -list\n            lists all running nodeServer processes"))
	console.log(chalk.cyanBright("        -startNPM n\n            starts n NPMServer processes"))
	console.log(chalk.cyanBright("        -listNPM\n            lists all running NPMServer processes"))
	console.log(chalk.cyanBright("        -kill\n            kills all running nodeServer processes"))
	console.log(chalk.cyanBright("        -updateTime\n            set update time in seconds, default 30"))
	console.log(chalk.cyanBright("        -?\n            displays this help menu\n"))
}



function displayTable(serverList, filename) {
	try{
		if (Object.keys(serverList).length === 1) {
			config = {
				columns: {
					0: {alignment: 'left',minWidth: 10},
					1: {alignment: 'left',minWidth: 10},
					2: {alignment: 'left',width: 35},
					3: {alignment: 'right',minWidth: 10}
				},
				border: {
					topBody: chalk.rgb(0,26,13)('─'),
					topJoin: chalk.rgb(0,26,13)('┬'),
					topLeft: chalk.rgb(0,26,13)('┌'),
					topRight: chalk.rgb(0,26,13)('┐'),

					bottomBody: chalk.rgb(0,26,13)('─'),
					bottomJoin: chalk.rgb(0,26,13)('┴'),
					bottomLeft: chalk.rgb(0,26,13)('└'),
					bottomRight: chalk.rgb(0,26,13)('┘'),

					bodyLeft: chalk.rgb(0,26,13)('│'),
					bodyRight: chalk.rgb(0,26,13)('│'),
					bodyJoin: chalk.rgb(0,26,13)('│'),

					joinBody: chalk.rgb(0,26,13)('─'),
					joinLeft: chalk.rgb(0,26,13)('├'),
					joinRight: chalk.rgb(0,26,13)('┤'),
					joinJoin: chalk.rgb(0,26,13)('┼')
				}
			};

			serverTable = [	['PID', 'CMD', 'FILE', 'PORT']	]
			for (var i = 0; i < serverList[filename].length; i++) {
				serverTable.push([
					chalk.green(serverList[filename][i].pid),
					chalk.magenta(serverList[filename][i].cmd),
					chalk.cyan(serverList[filename][i].file),
					chalk.red(serverList[filename][i].port)
				])
			}
			output = table.table(serverTable, config);
			process.stdout.write('\033c\033[2J'+output);
		}
		else{

			config = {
				columns: {
					0: { alignment: 'left',minWidth: 10 },
					1: { alignment: 'left',minWidth: 10 },
					2: { alignment: 'left',width: 35 },
					3: { alignment: 'right',minWidth: 10 },
					4: { alignment: 'left',minWidth: 5 },
					5: { alignment: 'left',minWidth: 10 },
					6: { alignment: 'left',minWidth: 10 },
					7: { alignment: 'left',width: 35 },
					8: { alignment: 'right',minWidth: 10 },
				},
				border: {
					topBody: chalk.rgb(0,26,13)('─'),
					topJoin: chalk.rgb(0,26,13)('┬'),
					topLeft: chalk.rgb(0,26,13)('┌'),
					topRight: chalk.rgb(0,26,13)('┐'),

					bottomBody: chalk.rgb(0,26,13)('─'),
					bottomJoin: chalk.rgb(0,26,13)('┴'),
					bottomLeft: chalk.rgb(0,26,13)('└'),
					bottomRight: chalk.rgb(0,26,13)('┘'),

					bodyLeft: chalk.rgb(0,26,13)('│'),
					bodyRight: chalk.rgb(0,26,13)('│'),
					bodyJoin: chalk.rgb(0,26,13)('│'),

					joinBody: chalk.rgb(0,26,13)('─'),
					joinLeft: chalk.rgb(0,26,13)('├'),
					joinRight: chalk.rgb(0,26,13)('┤'),
					joinJoin: chalk.rgb(0,26,13)('┼')
				}
			};

			serverTable = [['PID', 'CMD', 'FILE', 'PORT',' ', 'PID', 'CMD', 'FILE', 'PORT']]
			for (var i = 0; i < serverList[Object.keys(serverList)[0]].length; i++) {
				serverTable.push([
					chalk.green(serverList[Object.keys(serverList)[0]][i].pid), 
					chalk.magenta(serverList[Object.keys(serverList)[0]][i].cmd), 
					chalk.cyan(serverList[Object.keys(serverList)[0]][i].file), 
					chalk.red(serverList[Object.keys(serverList)[0]][i].port),
					" ",
					chalk.green(serverList[Object.keys(serverList)[1]][i].pid), 
					chalk.magenta(serverList[Object.keys(serverList)[1]][i].cmd), 
					chalk.cyan(serverList[Object.keys(serverList)[1]][i].file), 
					chalk.red(serverList[Object.keys(serverList)[1]][i].port),
				])
			}
			output = table.table(serverTable, config);
			process.stdout.write('\033c\033[2J'+output);
		
		}
	}
	catch{
		return
	}
}

function listenForConnections() {
	http.listen(5680, function(){
		console.log(chalk.rgb(33, 255, 0).bold.bgRgb(0, 25, 66)('    listening on 5680    '))
	});
	app.get('/', function (req, res) {
		console.log(serverList)
		res.redirect("http://afsconnect2.njit.edu:"
			+serverList["startNPMServer.js"][nextServer]["port"]
			+"/?"+(JSON.stringify({"serverPort":serverList["nodeServer.js"][nextServer++]["port"]})))
		if (nextServer >= maxServer) {nextServer = 0}
	})
}

function startNodeServers(filename, updateTime) {
	if (process.argv[3] === undefined){
		console.log(chalk.cyanBright("    -start n\n        starts n nodeServer.js processes"))
			return
	}
	const startList = []
	if (filename == "nodeServer.js") {startPort = 5681}
	else{startPort = 5781}
	
	for (let i = 0; i < process.argv[3]; i++) {
		startList.push(() => startSlaveNode([{command:"node", file: "./src/nodeServer/"+filename, args:startPort+i}]))
	}
	const arrayOfPromises = startList.map(task => task())
	Promise.all(arrayOfPromises)
	.then((failedToStart) =>{
		console.log(failedToStart)
	})
	run(startList, filename, updateTime)
}




function run(startList, filename, updateTime) {
	// if (process.argv[4] === "-update" && process.argv[5]) {}

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
		checkCurrentProcesses(filename)
		.then((data) => {
			serverList[filename] = formatPgrep(data)
			displayTable(serverList, filename)
			for (var i = 0; i < serverList[filename].length; i++) {
				portHash[serverList[filename][i].port] = 1
			}
			var restartList = []
			for(var pH in portHash){
				if(portHash[pH] == 0){
					restartList.push({command:"node", file: filename, args:pH})
				}
			}
			startSlaveNode(restartList)
 		})
	}, updateTime);
}

function checkCurrentProcesses(filename) {
	return new Promise(resolve =>{
		var parsedArray = []
		exec("pgrep -u mjk29 -f "+filename+" -a", (err, cmdOutput, stderr) => {
			if (err){	resolve({error:err})		}
			else	{	resolve({output:cmdOutput})	}
		});
	})
}

function formatPgrep(rawPgrep) {
	if ("error" in rawPgrep) {return []}

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






// function startNPMServers() {
// 	// if (process.argv[3] === undefined){
// 	// 	console.log(chalk.cyanBright("    -start n\n        starts n nodeServer.js processes"))
// 	// 		return
// 	// }
// 	const startList = []
// 	startPort = 5581
// 	for (let i = 0; i < 5; i++) {
// 		startList.push(() => startSlaveNPM([{prefix:"PORT="+(startPort+i), command: "npm start"}]))
// 	}
// 	console.log(startList)
// 	const arrayOfPromises = startList.map(task => task())
// 	Promise.all(arrayOfPromises)
// 	.then((failedToStart) =>{
// 		console.log(failedToStart)
// 	})
// 	// run(startList)
// }



// function startSlaveNPM(sL) {
// 	var unavailablePorts = []
// 	return new Promise(resolve =>{
// 		for (var i = 0; i < sL.length; i++) {
// 			exec(sL[i].prefix+" "+sL[i].command, (err, cmdOutput, stderr) => {
// 				if (err) {
// 					console.log(err)
// 					let m;
// 					const regex = /Error: listen EADDRINUSE :::(.*)/gm;
// 					while ((m = regex.exec(err.message)) !== null) {
// 						if (m.index === regex.lastIndex) {
// 							regex.lastIndex++;
// 						}
// 						// console.log(chalk.red(`${m[1]}`))
// 						unavailablePorts.push(m[1])
// 					}
// 					resolve(unavailablePorts)
// 				}
// 				else{
// 					console.log(cmdOutput)
// 				}
// 			});
// 		}
// 	})
// }




