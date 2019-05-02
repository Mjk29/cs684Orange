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
global.ghostname=""


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
	app.use(bodyParser.json())

getHostname()
.then((data)=>{
	ghostname = data
	main()
})



function main() {

	let startTime = 0
	switch(process.argv[2]){
		case "?":
			displayHelp()
			break

		case "-kill":
			killCommand()
			break

		case "-list":
			checkCurrentProcesses("nodeServer.js")
			.then((data) => {
				console.log(data)
				serverList["nodeServer.js"] = formatPgrep(data)
				displayTable(serverList, "nodeServer.js")
			})
			break

		case "-start":
			startTime = checkUpdateArgs()
			startNodeServers("nodeServer.js", startTime, process.argv[3],0)

			break

		case "-listNPM":
			checkCurrentProcesses("startNPMServer.js")
			.then((data) => {
				console.log(data)
				// serverList["startNPMServer.js"] = formatPgrep(data)
				// displayTable(serverList, "startNPMServer.js")
			})
			break
		case "-startNPM":
			startTime = checkUpdateArgs()
			startNodeServers("startNPMServer.js", startTime, process.argv[3],0) 
			break
		
		case "-run":
			startTime = checkUpdateArgs()
			startNodeServers("startNPMServer.js", startTime, process.argv[3],0)
			startNodeServers("nodeServer.js", startTime, process.argv[3],0)
			
			listenForConnections()
			break

		case "-testBuild":
			testBuild()
			break

		case "-testServers":
		checkCurrentProcesses("startNPMServer.js")
			.then((data) => {
				if ("error" in data) {
					startNodeServers("startNPMServer.js", 8000, process.argv[3],1)
					startNodeServers("nodeServer.js", 8000, process.argv[3],1)
					startNodeServerTest()
				}
				else{
					startNodeServerTest()
				}
			})

			break

		default:
			displayHelp()
			break
	}
}

function killCommand() {
	checkCurrentProcesses("nodeServer.js")
	.then((data) => {
		killProcesses(formatPgrep(data))
	})
	checkCurrentProcesses("startNPMServer.js")
	.then((data) => {
		killProcesses(formatPgrep(data))
	})
}

function testBuild() {
	getHostname()
	.then((data)=>{
		// data.cmdOutput =  `afsconnect2.njit.edu\\n`
		const regex = /afsconnect\d\.njit\.edu\\n/gm;
		if (regex.test(data.cmdOutput)){
			console.log(chalk.magentaBright.inverse.bold(
				" You appear to be running this command on afsconnect    \n This is not advised as afs build takes several minutes "
				))
			const readline = require('readline').createInterface({
				input: process.stdin,
				output: process.stdout
			})
			readline.question(` Continue with npm run build command??? (y,n)\n > `, (usrInput) => {
				if (usrInput === 'y' || usrInput === 'Y') {
					exec("npm run build", (err, cmdOutput, stderr) => {
						if (err){
							console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(" Deployment Build Failed"))
							if(process.argv[3] === "--verbose"){
								console.log(chalk.red(err))
							}
						}
						else{
							console.log(chalk.bold.greenBright.bgBlack('  \u2713  ')+chalk.bold.greenBright(" Deployment Build Success"))
							if(process.argv[3] === "--verbose"){
								console.log(chalk.green(cmdOutput))
							}
						}
					})
				}
				readline.close()
			})
		}
	})
}





function checkUpdateArgs() {
	let updateTimeArg = parseInt(process.argv[5], 10)
	if(Number.isInteger(updateTimeArg) && updateTimeArg >= 1){
		return (updateTimeArg*1000)
	}
	else{
		console.log(chalk.redBright("unusable update time : "+ updateTimeArg))
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
	catch{return}
}

function listenForConnections() {
	
	getHostname()
	.then(data=>{
		console.log(data)
		var hostname = data.cmdOutput.split('\n')[0]
		console.log(hostname)
		http.listen(5680)
			app.get('/', function (req, res) {
				res.redirect(`http://${hostname}:`
					+serverList["startNPMServer.js"][nextServer]["port"]
					+"/?"+(JSON.stringify({
						"serverPort":serverList["nodeServer.js"][nextServer++]["port"],
						"dashboardPort":5581,
						"hostname":hostname
					})))
				if (nextServer >= maxServer) {nextServer = 0}
			})
	})

	
}

function startNodeServers(filename, updateTime, numberOfServers, test) {
	// return new Promise.all(resolve => {
		if (numberOfServers === undefined){
			console.log(chalk.cyanBright("    -start n\n        starts n nodeServer.js processes"))
				return
		}
		const startList = []
		if (filename == "nodeServer.js") {startPort = 5681}
		else{startPort = 5181}
		
		for (let i = 0; i < numberOfServers; i++) {
			startList.push(() => startSlaveNode([{command:"node", file: "./src/nodeServer/"+filename, args:startPort+i}]))
		}
		const arrayOfPromises = startList.map(task => task())
		Promise.all(arrayOfPromises)
		if (test == 1) {
			return
		}
		else if (test == 0) {
			run(startList, filename, updateTime, test)
		}
		
}


function startNodeServerTest() {

	var filenameArr = ["nodeServer.js", "startNPMServer.js", "thisWillFail.js"]
	var expectedResponseArr = [
		{output:'5162 nodeX ./src/nodeServer/nodeServer.jsX 5681X\n5169 node ./src/nodeServer/nodeServer.js 5682\n5182 node ./src/nodeServer/nodeServer.js 5683\n5190 node ./src/nodeServer/nodeServer.js 5684\n5197 node ./src/nodeServer/nodeServer.js 5685\n5206 node ./src/nodeServer/nodeServer.js 5686\n5226 node ./src/nodeServer/nodeServer.js 5687\n5232 node ./src/nodeServer/nodeServer.js 5688\n5236 node ./src/nodeServer/nodeServer.js 5689\n5241 node ./src/nodeServer/nodeServer.js 5690\n5244 node ./src/nodeServer/nodeServer.js 5691\n5256 node ./src/nodeServer/nodeServer.js 5692\n5279 node ./src/nodeServer/nodeServer.js 5693\n5286 node ./src/nodeServer/nodeServer.js 5694\n5302 node ./src/nodeServer/nodeServer.js 5695\n5317 node ./src/nodeServer/nodeServer.js 5696\n5322 node ./src/nodeServer/nodeServer.js 5697\n5325 node ./src/nodeServer/nodeServer.js 5698\n5327 node ./src/nodeServer/nodeServer.js 5699\n5330 node ./src/nodeServer/nodeServer.js 5700\n5337 node ./src/nodeServer/nodeServer.js 5701\n5344 node ./src/nodeServer/nodeServer.js 5702\n5350 node ./src/nodeServer/nodeServer.js 5703\n5355 node ./src/nodeServer/nodeServer.js 5704\n5360 node ./src/nodeServer/nodeServer.js 5705\n5377 node ./src/nodeServer/nodeServer.js 5706\n5398 node ./src/nodeServer/nodeServer.js 5707\n5410 node ./src/nodeServer/nodeServer.js 5708\n5420 node ./src/nodeServer/nodeServer.js 5709\n5435 node ./src/nodeServer/nodeServer.js 5710\n5442 node ./src/nodeServer/nodeServer.js 5711\n5448 node ./src/nodeServer/nodeServer.js 5712\n5449 node ./src/nodeServer/nodeServer.js 5713\n5453 node ./src/nodeServer/nodeServer.js 5714\n5468 node ./src/nodeServer/nodeServer.js 5715\n5472 node ./src/nodeServer/nodeServer.js 5716\n5474 node ./src/nodeServer/nodeServer.js 5717\n5475 node ./src/nodeServer/nodeServer.js 5718\n5477 node ./src/nodeServer/nodeServer.js 5719\n5478 node ./src/nodeServer/nodeServer.js 5720\n5479 node ./src/nodeServer/nodeServer.js 5721\n5486 node ./src/nodeServer/nodeServer.js 5722\n5512 node ./src/nodeServer/nodeServer.js 5723\n5513 node ./src/nodeServer/nodeServer.js 5724\n5518 node ./src/nodeServer/nodeServer.js 5725\n5525 node ./src/nodeServer/nodeServer.js 5726\n5542 node ./src/nodeServer/nodeServer.js 5727\n5545 node ./src/nodeServer/nodeServer.js 5728\n5555 node ./src/nodeServer/nodeServer.js 5729\n5561 node ./src/nodeServer/nodeServer.js 5730\n5572 node ./src/nodeServer/nodeServer.js 5731\n5576 node ./src/nodeServer/nodeServer.js 5732\n5580 node ./src/nodeServer/nodeServer.js 5733\n5593 node ./src/nodeServer/nodeServer.js 5734\n5604 node ./src/nodeServer/nodeServer.js 5735\n5608 node ./src/nodeServer/nodeServer.js 5736\n5617 node ./src/nodeServer/nodeServer.js 5737\n5650 node ./src/nodeServer/nodeServer.js 5738\n5652 node ./src/nodeServer/nodeServer.js 5739\n5653 node ./src/nodeServer/nodeServer.js 5740\n5654 node ./src/nodeServer/nodeServer.js 5741\n5655 node ./src/nodeServer/nodeServer.js 5742\n5661 node ./src/nodeServer/nodeServer.js 5743\n5677 node ./src/nodeServer/nodeServer.js 5744\n5686 node ./src/nodeServer/nodeServer.js 5745\n5706 node ./src/nodeServer/nodeServer.js 5746\n5709 node ./src/nodeServer/nodeServer.js 5747\n5713 node ./src/nodeServer/nodeServer.js 5748\n5716 node ./src/nodeServer/nodeServer.js 5749\n5717 node ./src/nodeServer/nodeServer.js 5750\n5719 node ./src/nodeServer/nodeServer.js 5751\n5726 node ./src/nodeServer/nodeServer.js 5752\n5728 node ./src/nodeServer/nodeServer.js 5753\n5750 node ./src/nodeServer/nodeServer.js 5754\n5761 node ./src/nodeServer/nodeServer.js 5755\n5782 node ./src/nodeServer/nodeServer.js 5756\n5784 node ./src/nodeServer/nodeServer.js 5757\n5785 node ./src/nodeServer/nodeServer.js 5758\n5787 node ./src/nodeServer/nodeServer.js 5759\n5789 node ./src/nodeServer/nodeServer.js 5760\n5796 node ./src/nodeServer/nodeServer.js 5761\n5817 node ./src/nodeServer/nodeServer.js 5762\n5819 node ./src/nodeServer/nodeServer.js 5763\n5821 node ./src/nodeServer/nodeServer.js 5764\n5822 node ./src/nodeServer/nodeServer.js 5765\n5828 node ./src/nodeServer/nodeServer.js 5766\n5850 node ./src/nodeServer/nodeServer.js 5767\n5852 node ./src/nodeServer/nodeServer.js 5768\n5857 node ./src/nodeServer/nodeServer.js 5769\n5875 node ./src/nodeServer/nodeServer.js 5770\n5882 node ./src/nodeServer/nodeServer.js 5771\n5900 node ./src/nodeServer/nodeServer.js 5772\n5916 node ./src/nodeServer/nodeServer.js 5773\n5923 node ./src/nodeServer/nodeServer.js 5774\n5928 node ./src/nodeServer/nodeServer.js 5775\n5934 node ./src/nodeServer/nodeServer.js 5776\n5948 node ./src/nodeServer/nodeServer.js 5777\n5959 node ./src/nodeServer/nodeServer.js 5778\n5968 node ./src/nodeServer/nodeServer.js 5779\n5969 node ./src/nodeServer/nodeServer.js 5780\n'},
		{output:'4434 nodeX ./src/nodeServer/startNPMServer.jsX 5181X\n4436 node ./src/nodeServer/startNPMServer.js 5182\n4442 node ./src/nodeServer/startNPMServer.js 5183\n4449 node ./src/nodeServer/startNPMServer.js 5184\n4456 node ./src/nodeServer/startNPMServer.js 5185\n4463 node ./src/nodeServer/startNPMServer.js 5186\n4470 node ./src/nodeServer/startNPMServer.js 5187\n4477 node ./src/nodeServer/startNPMServer.js 5188\n4484 node ./src/nodeServer/startNPMServer.js 5189\n4491 node ./src/nodeServer/startNPMServer.js 5190\n4498 node ./src/nodeServer/startNPMServer.js 5191\n4505 node ./src/nodeServer/startNPMServer.js 5192\n4512 node ./src/nodeServer/startNPMServer.js 5193\n4519 node ./src/nodeServer/startNPMServer.js 5194\n4527 node ./src/nodeServer/startNPMServer.js 5195\n4534 node ./src/nodeServer/startNPMServer.js 5196\n4540 node ./src/nodeServer/startNPMServer.js 5197\n4542 node ./src/nodeServer/startNPMServer.js 5198\n4551 node ./src/nodeServer/startNPMServer.js 5199\n4560 node ./src/nodeServer/startNPMServer.js 5200\n4565 node ./src/nodeServer/startNPMServer.js 5201\n4574 node ./src/nodeServer/startNPMServer.js 5202\n4579 node ./src/nodeServer/startNPMServer.js 5203\n4584 node ./src/nodeServer/startNPMServer.js 5204\n4588 node ./src/nodeServer/startNPMServer.js 5205\n4601 node ./src/nodeServer/startNPMServer.js 5206\n4610 node ./src/nodeServer/startNPMServer.js 5207\n4615 node ./src/nodeServer/startNPMServer.js 5208\n4620 node ./src/nodeServer/startNPMServer.js 5209\n4621 node ./src/nodeServer/startNPMServer.js 5210\n4625 node ./src/nodeServer/startNPMServer.js 5211\n4638 node ./src/nodeServer/startNPMServer.js 5212\n4653 node ./src/nodeServer/startNPMServer.js 5213\n4654 node ./src/nodeServer/startNPMServer.js 5214\n4660 node ./src/nodeServer/startNPMServer.js 5215\n4669 node ./src/nodeServer/startNPMServer.js 5216\n4672 node ./src/nodeServer/startNPMServer.js 5217\n4677 node ./src/nodeServer/startNPMServer.js 5218\n4682 node ./src/nodeServer/startNPMServer.js 5219\n4697 node ./src/nodeServer/startNPMServer.js 5220\n4710 node ./src/nodeServer/startNPMServer.js 5221\n4713 node ./src/nodeServer/startNPMServer.js 5222\n4714 node ./src/nodeServer/startNPMServer.js 5223\n4717 node ./src/nodeServer/startNPMServer.js 5224\n4724 node ./src/nodeServer/startNPMServer.js 5225\n4731 node ./src/nodeServer/startNPMServer.js 5226\n4748 node ./src/nodeServer/startNPMServer.js 5227\n4758 node ./src/nodeServer/startNPMServer.js 5228\n4763 node ./src/nodeServer/startNPMServer.js 5229\n4767 node ./src/nodeServer/startNPMServer.js 5230\n4773 node ./src/nodeServer/startNPMServer.js 5231\n4776 node ./src/nodeServer/startNPMServer.js 5232\n4786 node ./src/nodeServer/startNPMServer.js 5233\n4791 node ./src/nodeServer/startNPMServer.js 5234\n4802 node ./src/nodeServer/startNPMServer.js 5235\n4812 node ./src/nodeServer/startNPMServer.js 5236\n4821 node ./src/nodeServer/startNPMServer.js 5237\n4827 node ./src/nodeServer/startNPMServer.js 5238\n4838 node ./src/nodeServer/startNPMServer.js 5239\n4844 node ./src/nodeServer/startNPMServer.js 5240\n4849 node ./src/nodeServer/startNPMServer.js 5241\n4858 node ./src/nodeServer/startNPMServer.js 5242\n4862 node ./src/nodeServer/startNPMServer.js 5243\n4871 node ./src/nodeServer/startNPMServer.js 5244\n4881 node ./src/nodeServer/startNPMServer.js 5245\n4891 node ./src/nodeServer/startNPMServer.js 5246\n4894 node ./src/nodeServer/startNPMServer.js 5247\n4903 node ./src/nodeServer/startNPMServer.js 5248\n4916 node ./src/nodeServer/startNPMServer.js 5249\n4921 node ./src/nodeServer/startNPMServer.js 5250\n4924 node ./src/nodeServer/startNPMServer.js 5251\n4931 node ./src/nodeServer/startNPMServer.js 5252\n4938 node ./src/nodeServer/startNPMServer.js 5253\n4943 node ./src/nodeServer/startNPMServer.js 5254\n4949 node ./src/nodeServer/startNPMServer.js 5255\n4962 node ./src/nodeServer/startNPMServer.js 5256\n4967 node ./src/nodeServer/startNPMServer.js 5257\n4977 node ./src/nodeServer/startNPMServer.js 5258\n4987 node ./src/nodeServer/startNPMServer.js 5259\n4994 node ./src/nodeServer/startNPMServer.js 5260\n4996 node ./src/nodeServer/startNPMServer.js 5261\n5002 node ./src/nodeServer/startNPMServer.js 5262\n5010 node ./src/nodeServer/startNPMServer.js 5263\n5015 node ./src/nodeServer/startNPMServer.js 5264\n5017 node ./src/nodeServer/startNPMServer.js 5265\n5023 node ./src/nodeServer/startNPMServer.js 5266\n5030 node ./src/nodeServer/startNPMServer.js 5267\n5036 node ./src/nodeServer/startNPMServer.js 5268\n5041 node ./src/nodeServer/startNPMServer.js 5269\n5059 node ./src/nodeServer/startNPMServer.js 5270\n5085 node ./src/nodeServer/startNPMServer.js 5271\n5092 node ./src/nodeServer/startNPMServer.js 5272\n5093 node ./src/nodeServer/startNPMServer.js 5273\n5096 node ./src/nodeServer/startNPMServer.js 5274\n5107 node ./src/nodeServer/startNPMServer.js 5275\n5118 node ./src/nodeServer/startNPMServer.js 5276\n5134 node ./src/nodeServer/startNPMServer.js 5277\n5140 node ./src/nodeServer/startNPMServer.js 5278\n5148 node ./src/nodeServer/startNPMServer.js 5279\n5156 node ./src/nodeServer/startNPMServer.js 5280\n'}
	]
		
 	

		checkCurrentProcesses("nodeServer.js")
		.then((data) => {
			var liveData = formatPgrep(data)
			var testData = formatPgrep(expectedResponseArr[0])
			for (var i = 0; i < liveData.length; i++) {
				if (i >= 100) {
					console.log(chalk.magenta(""))
					process.exit()	
				}
				let passed = true
				if (liveData[i].cmd !== testData[i].cmd) {
					console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(` Server ${i} Failed mismatched cmd  `+JSON.stringify(liveData[i]) ))
					passed = false
				}
				if (liveData[i].file !== testData[i].file) {
					console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(` Server ${i} Failed mismatched file `+JSON.stringify(liveData[i])))
					passed = false
				}
				if (liveData[i].port !== testData[i].port) {
					console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(` Server ${i} Failed mismatched port `+JSON.stringify(liveData[i])))
					passed = false
				}
				if(passed == true){
					console.log(chalk.bold.greenBright.bgBlack('  \u2713  ')+chalk.bold.greenBright(`Node Server ${i} Passed`))
				}
				
			}
	})

				checkCurrentProcesses("startNPMServer.js")
		.then((data) => {
			var liveData = formatPgrep(data)
			var testData = formatPgrep(expectedResponseArr[1])
			for (var i = 0; i < liveData.length; i++) {
				if (i >= 100) {
					console.log(chalk.magenta(""))
					process.exit()	
				}
				let passed = true
				if (liveData[i].cmd !== testData[i].cmd) {
					console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(` Server ${i} Failed mismatched cmd  `+JSON.stringify(liveData[i]) ))
					passed = false
				}
				if (liveData[i].file !== testData[i].file) {
					console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(` Server ${i} Failed mismatched file `+JSON.stringify(liveData[i])))
					passed = false
				}
				if (liveData[i].port !== testData[i].port) {
					console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(` Server ${i} Failed mismatched port `+JSON.stringify(liveData[i])))
					passed = false
				}
				if(passed == true){
					console.log(chalk.bold.greenBright.bgBlack('  \u2713  ')+chalk.bold.greenBright(`NPM Server ${i} Passed`))
				}
				
			}
			process.exit()
	})



}



function run(startList, filename, updateTime, test) {
	var minutes = 5
	var portHash = {}
	for (var i = 0; i < startList.length; i++) {
		portHash[startList[i].args] = 0
	}
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


		const regex = /afsconnect\d\.njit\.edu\\n/gm;
		if (regex.test(ghostname)) {
			pgrepString = "pgrep -u \"$(whoami)\" -f "+filename+" -a"
		}
		else{
			pgrepString = "pgrep -u \"$(whoami)\" -f "+filename+" -a | grep -v \"/bin/sh\""
		}


		return new Promise(resolve =>{
			var parsedArray = []
			exec(pgrepString, (err, cmdOutput, stderr) => {
				if (err){	
					resolve({error:err})		
				}
				else{	
					console.log(cmdOutput)
	 				resolve({output:cmdOutput})	
				}
			});
		})
}

function getHostname() {
	return new Promise(resolve =>{
		var parsedArray = []
		exec("hostname", (err, cmdOutput, stderr) => {
			if (err){	resolve({error:err})		}
			else	{	resolve({cmdOutput})	}
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
	return new Promise((resolve, reject) =>{
		for (var i = 0; i < sL.length; i++) {
			exec(sL[i].command+" "+sL[i].file+" "+sL[i].args, (err, stdout, stderr) => {
				if (err) {
					let m;
					const regex = /Error: listen EADDRINUSE :::(.*)/gm;
					while ((m = regex.exec(err.message)) !== null) {
						if (m.index === regex.lastIndex) {
							regex.lastIndex++;
						}
						unavailablePorts.push(m[1])
					}
					resolve({port:unavailablePorts[0]})
				}
				else{
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




