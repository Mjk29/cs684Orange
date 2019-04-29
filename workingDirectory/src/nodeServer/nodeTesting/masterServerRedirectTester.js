var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var itemTableName = "684Items"
var cartTableName = "684Cart"
const fetch = require('node-fetch');
var Promise = require('promise');
var async = require("async");
const chalk = require('chalk');
const { exec } = require('child_process');
var fs = require('fs');
var table = require('table')


main()

function main() {
	switch(process.argv[2]){
		case "-connection":
			connectionTester()
			break

		case "-stress":
			aTest()
			.then((data)=> {
				formatATest(data)
			})
			break

		default:
		console.log("enter args")
	}

}

function formatATest(dataIn) {
	fs.readFile('test.json', 'utf8', function(err, contents) {
		

var tableConfig = {
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

		var tableData = JSON.parse(contents).aggregate
		console.log(tableData)
		var serverTable = [
			[
				'#ofRequests',
				'requestsPerSecond',
				'minLatency',
				'maxLatency',
				'medianLatency',
				'p95Latency',
				'p99Latency',
				'timeElapsed',
			],
			[
				tableData.requestsCompleted,
				tableData.rps.mean,
				tableData.latency.min + " ms",
				tableData.latency.max + " ms",
				tableData.latency.median + " ms",
				tableData.latency.p95 + " ms",
				tableData.latency.p99 + " ms",
				dataIn.timer.elapsed +" ms"
			]
		]

	var codeTable = [[],[]]
	for( code in tableData.codes){
		if (code === "200" ||code === "301" ||code === "302") {
			codeTable[0].push(chalk.green.inverse(code))
			codeTable[1].push(chalk.green.inverse(tableData.codes[code]))
		}
		else{
			codeTable[0].push(chalk.red.inverse(code))
			codeTable[1].push(chalk.red.inverse(tableData.codes[code]))
		}
		
	}

	var table1 = table.table(serverTable, tableConfig)
	var table2 = table.table(codeTable, tableConfig)
	process.stdout.write('\033c\033[2J'+table1+table2);

});
}




 

function aTest() {
	if (Number.isInteger(parseInt(process.argv[3], 10)) && Number.isInteger(parseInt(process.argv[4], 10))) {
		var numUsers = parseInt(process.argv[3], 10)
		var numRequests = parseInt(process.argv[4], 10)
	}
	else{
		console.log(chalk.red(" Malformed user and request values"))
		console.log(chalk.red(" $node masterServerRedirectTester.js -stress numUsers numRequests"))
		process.exit()
	}
	let timer = { time0:0, time1:1, elapsed:0 }
	timer.time0 = Date.now()
	return new Promise((resolve, reject) =>{
		var parsedArray = []
		exec(`../../../node_modules/artillery/bin/./artillery quick --count ${process.argv[3]} -n ${process.argv[4]} https://web.njit.edu/~mjk29/reactApp.php -o test.json`, (err, cmdOutput, stderr) => {
			if (err){	
				reject({error:err})		
			}
			else{	
				timer.time1 = Date.now()
				timer.elapsed = (timer.time1 - timer.time0)
 				resolve({output:cmdOutput, timer:timer})	
			}
		});
	})


}


function connectionTester() {
	for (var i = 0; i < process.argv[3]; i++) {
		fetchURLInfo("https://web.njit.edu/~mjk29/reactApp.php")
		.catch((data)=>{
			console.log(data)
			console.log(chalk.bold.redBright.bgBlack('  \u03A7  ')+chalk.bold.redBright(` Failed : Fetch from PHP Page`))
			return
		})
		.then((data)=>{		
			let redirectHeader = data.output.split("\r\n")
			let masterServer = redirectHeader[4].split(' ')[1]

			fetchURLInfo(masterServer)
			.catch((data)=>{
				console.log(chalk.bold.redBright.bgBlack('  \u03A7  ')+chalk.bold.redBright(` Failed : Fetch from Master Server`))
				return	
			})
			.then((data)=>{
				let redirectHeaderSecond = data.output.split("\r\n")
				let slaveServer = redirectHeaderSecond[4].split(' ')[1]
				let slaveServerDecoded = decodeURIComponent(slaveServer)

				fetchURLInfo(slaveServer)
				.catch((data)=>{
					console.log(chalk.bold.redBright.bgBlack('  \u03A7  ')+chalk.bold.redBright(` Failed : Fetch from Slave Server`))
					return
				})

				.then((data)=>{
					let npmServerHeader = data.output.split("\r\n")
					if(npmServerHeader[0].split(' ')[1] === "200"){
						console.log(chalk.bold.greenBright.bgBlack('  \u2713  ')+chalk.bold.greenBright(` Passed : ${slaveServerDecoded}`))
					}
					else{
						console.log(chalk.bold.redBright.bgBlack('  \u2713  ')+chalk.bold.redBright(` Failed : ${slaveServerDecoded}`))
					}
				})
			})
		})
	}
}



function fetchURLInfo(address) {
	return new Promise((resolve, reject) =>{
		var parsedArray = []
		exec(`curl ${address} -I`, (err, cmdOutput, stderr) => {
			if (err){	
				reject({error:err})		
			}
			else{	
 				resolve({output:cmdOutput})	
			}
		});
	})
}


