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
			if (process.argv[5] === "-loop" && Number.isInteger(parseInt(process.argv[6], 10))){
				console.log(process.argv[5])
				console.log(process.argv[6])
			}
		
			setInterval(()=>{
				aTest()
				.then((data)=> {
				formatATest(data)
			})
			}, process.argv[6]*1000)

			
			break

		default:
		console.log(" -connection n")
		console.log(" -stress n n")
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
		// console.log(tableData)
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
		// console.log(tableData.codes)
	var codeTable = [[],[]]
	for( code in tableData.codes){
		if (code === "200") {
			codeTable[0].push(chalk.green.inverse(code))
			codeTable[1].push(chalk.green.inverse(tableData.codes[code]))
		}
		else if(code === "301" ){
			console.log("300")
			codeTable[0].push(chalk.green.inverse(code))
			codeTable[1].push(chalk.green.inverse(tableData.codes[code]))
		}
		else if(code === "302"){
			codeTable[0].push(chalk.green.inverse(code))
			codeTable[1].push(chalk.green.inverse(tableData.codes[code]))
		}
		else if(code === "500"){
			codeTable[0].push(chalk.red.inverse(code))
			codeTable[1].push(chalk.red.inverse(tableData.codes[code]))
		}
		else{
			codeTable[0].push(chalk.red.inverse(code))
			codeTable[1].push(chalk.red.inverse(tableData.codes[code]))
		}
		
	}


	var table1 = table.table(serverTable, tableConfig)
	var table2 = table.table(codeTable, tableConfig)
	process.stdout.write('\033c\033[2J'+table1+table2);
	// console.log(table1)
	// console.log(table2)
var myobj = {}
myobj["qString"]=
		"INSERT INTO ma995.\`684Testing\`"
		+"(testName, command, "
		+"args, \`timestamp\`, numberOfRequests, "
		+"requestsPerSecond, minLatency, maxLatency, "
		+"medianLatency, p95Latency, p99Latency, "
		+"timeElapsed, 200Response, 301Response, "
		+"302Response, 500Response, otherResponse)"
	+"VALUES("
		+"\"stress\", \"node masterServerRedirectTester.js -stress\", "
		+"\""+parseInt(process.argv[3], 10)+" "
		+parseInt(process.argv[4], 10)+"\", "
		+"NOW(), "
		+tableData.requestsCompleted+","
		+tableData.rps.mean+", "
		+tableData.latency.min+", "
		+tableData.latency.max +", "
		+tableData.latency.median+", "
		+tableData.latency.p95+", "
		+tableData.latency.p99+", "
		+dataIn.timer.elapsed +", "
		+tableData.codes["200"]+", "
		+tableData.codes["301"]+", "
		+tableData.codes["302"]+", "
		+"0,0"
		+");"

		// console.log(myobj)

	dbConnect(myobj["qString"])
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






function dbConnect(qString){
	// console.log("db function")
	// console.log(qString)
	var mysql = require('mysql') 
	var connection = mysql.createConnection({
	  host     : 'sql.njit.edu',
	  user     : 'ma995',
	  password : 'pickup82',
	  database : 'ma995'
	});

	connection.connect()

	connection.query(qString, function (err, rows, fields) {
	if (err){
 		console.log(err)
 		return

	}
})

	connection.end()
}