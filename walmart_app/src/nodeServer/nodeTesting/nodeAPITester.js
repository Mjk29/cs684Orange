var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var itemTableName = "684Items"
var cartTableName = "684Cart"
const fetch = require('node-fetch');
var Promise = require('promise');
var async = require("async");
const chalk = require('chalk');
var ss = require('simple-statistics')
var table = require('table')
var randomWords = require('random-words');



main()

function main(){

	switch(process.argv[2]){
		case "-apiTest":
			apiTest()
			break

		case "-stress":
			statsTester()

		break

		default:
			console.log(chalk.cyanBright("    -apiTest"))
			console.log(chalk.cyanBright("    -stress n"))
		break
	}




}


function apiTest() {
	console.log(chalk.bgBlackBright.yellowBright("                                  "))
	console.log(chalk.bgBlackBright.yellowBright("    Node Server Tester Running    "))

	var queryArray = createQueryArray();
	var expectedResponseArray = createExpectedResponseArray()

	var qsize = {
		queryArraySize:Object.keys(queryArray).length, 
		expectedResponseArraySize:Object.keys(expectedResponseArray).length
	}
	console.log(chalk.cyanBright.bgBlackBright("        Testing  "+qsize.queryArraySize+"  queries       "))
	console.log(chalk.cyanBright.bgBlackBright("       Expecting "+qsize.expectedResponseArraySize+" responses      "))
	console.log(chalk.bgBlackBright.yellowBright("                                  "))
	serverTester(queryArray, expectedResponseArray)
}


function createStatTestArray(number) {
	
 	var returnArray = []
	for (var i = 0; i < number; i++) {
		returnArray.push(
			`CALL testStats('%${randomWords()}%', '%${randomWords()}%','%${randomWords()}%','%${randomWords()}%', '%${randomWords()}%')`
		)
	}
	return returnArray

}


function statsTester() {

	if (Number.isInteger(parseInt(process.argv[3], 10))) {
		var numberToGenerate = parseInt(process.argv[3], 10)
	}
	else{
		console.log(chalk.cyanBright("    -stress n"))
		return
	}


 	console.log(chalk.bgBlackBright.yellowBright("                                  "))
	console.log(chalk.bgBlackBright.yellowBright("    SQL RESPONSE TIME TESTING     "))
	var standardArray=[
		"CALL testStats('%halo%', '%starcraft%','%coffee%','%dude%', '%qwdqwdqwdqwdqwd%')",
		"CALL testStats('%HDD%', '%piano%','%orange%','%d12t53g2wg335%', '%frog%')",
		"CALL testStats('%black%', '%refurbished%','%dg43g3zxv434%','%university%', '%logitech%')",
		"CALL testStats('%onya%', '%fd34q34f34gf3%','%men%','%beans%', '%radar%')",
		"CALL testStats('%g542gwgq23g4%', '%girl%','%penguin%','%rope%', '%gasket%')",

		"CALL testStats('%crayola%', '%thomas%','%protective%','%toddler%', '%vby456n34%')",
		"CALL testStats('%blue%', '%e%','%black%','%f431saef%', '%kitchen%')",
		"CALL testStats('%all%', '%google%','%f434fgssaq%','%countdown%', '%skin%')",
		"CALL testStats('%onya%', '%fd34q34f34gf3%','%men%','%beans%', '%radar%')",
		"CALL testStats('%fgfg33kkk%', '%gun%','%body%','%golden%', '%white%')",

		"CALL testStats('%clock%', '%olive%','%engraving%','%silver%', '%j8k57jr5%')",
		"CALL testStats('%garmin%', '%arrow%','%paperweight%','%h65wwh 5gq%', '%old%')",
		"CALL testStats('%high%', '%tablet%','%b7enyw%','%swing%', '%mini%')",
		"CALL testStats('%four%', '%vrq41%','%bicycle%','%coop%', '%disney%')",
		"CALL testStats('%b45w11t4%', '%harmony%','%design%','%star%', '%trek%')",

		"CALL testStats('%chocolate%', '%ring%','%whisper%','%champion%', '%zzxcv4%')",
		"CALL testStats('%suave%', '%epson%','%lousiana%','% up98v -3%', '%great%')",
		"CALL testStats('%child%', '%anniversary%','%b437nhtr%','%pack%', '%acer%')",
		"CALL testStats('%yoga%', '%-p0-o0%','%sand%','%master%', '%chief%')",
		"CALL testStats('%c8972h%', '%comfy%','%hammer%','%armor%', '%small%')",
	]

	var queryArray = standardArray.concat(createStatTestArray(numberToGenerate))


	var fetchOptions = {
		method: 'POST',
		mode: "cors",
		dataType: 'jsonp',
		credentials: "same-origin", 
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			searchType: "selectTest",
			query:queryArray[i],
		}),
	}


	var fetchBody = []

	for (var i = 0; i < queryArray.length; i++) {
		fetchBody.push(createFetchBody(queryArray[i]))
	}


	let timer = { time0:0, time1:1, elapsed:0 }
	timer.time0 = Date.now()

	var serverUrl = 'http://afsconnect2.njit.edu:5681'
	var promises = fetchBody.map(testCase => fetch(serverUrl, testCase).then(y => y.text()));

	Promise.all(promises).then(results => {
		timer.time1 = Date.now()
		timer.elapsed = (timer.time1 - timer.time0)
		displayStatsTable(results, queryArray.length*5, timer)
	});
}


function createFetchBody(qString) {
	return fetchOptions = {
		method: 'POST',
		mode: "cors",
		dataType: 'jsonp',
		credentials: "same-origin", 
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			searchType: "selectTest",
			query:qString
		})
	}
}


function displayStatsTable(statsRow, numberofqueries, timer) {

	var statArray = []
	for (var i = 0; i < statsRow.length; i++) {
		results = JSON.parse(statsRow[i])["rows"][5]
		for(stat in results){
			statArray.push(results[stat].Duration)
		}
	}
	var timingObj = {
		min:Math.trunc(ss.min(statArray)*1000),
		med:Math.trunc(ss.median(statArray)*1000),
		max:Math.trunc(ss.max(statArray)*1000),
		std:Math.trunc(ss.standardDeviation(statArray)*1000),
		p95:Math.trunc(ss.quantile(statArray, .95)*1000),
		p99:Math.trunc(ss.quantile(statArray, .99)*1000)
	}



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
	


	var serverTable = [
			[
				'#ofQueries',
				'requestsPerSecond',
				'minLatency',
				'maxLatency',
				'medianLatency',
				'p95Latency',
				'p99Latency',
				'timeElapsed',
			],
			[
				numberofqueries,
				(numberofqueries/timer.elapsed*1000).toFixed(2),
				timingObj.min + " ms",
				timingObj.max + " ms",
				timingObj.med + " ms",
				timingObj.p95 + " ms",
				timingObj.p99 + " ms",
				timer.elapsed +" ms"
			]
		]

	var table1 = table.table(serverTable, tableConfig)

	console.log(chalk.cyanBright.bgBlackBright("              Results             "))
	console.log(chalk.bgBlackBright.yellowBright("                                  "))
 	console.log(table1)




var qString =
		"INSERT INTO ma995.\`684Testing\`"
		+"(testName, command, "
		+"args, \`timestamp\`, numberOfRequests, "
		+"requestsPerSecond, minLatency, maxLatency, "
		+"medianLatency, p95Latency, p99Latency, "
		+"timeElapsed)"
	+"VALUES("
		+"\"sqlStressTest\", \"node nodeAPITester.js -stress\", "
		+"\""+parseInt(process.argv[3], 10)+" "
		+parseInt(process.argv[4], 10)+"\", "
		+"NOW(), "
		+numberofqueries+","
		+(numberofqueries/timer.elapsed*1000).toFixed(2)+", "
		+timingObj.min+", "
		+timingObj.max +", "
		+timingObj.med+", "
		+timingObj.p95+", "
		+timingObj.p99+", "
		+timer.elapsed 
		+");"

	dbConnect(qString)


}





function serverTester(queryArray, expectedResponseArray){
	var returnedA = []
	for(Q in queryArray){

		fetch('http://afsconnect2.njit.edu:5681', {
			method: 'POST',
			mode: "cors",
			dataType: 'jsonp',
			credentials: "same-origin", 
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				searchType: queryArray[Q].searchType,
				query:queryArray[Q].query,
				queryNumber:queryArray[Q].queryNumber,

			}),
		})
		.then(res => res.text())
		.then(body => {
  			testSingleItemQuery(body)
 		})
		.catch(error => console.error('Error:', error))
	}
}




function testSingleItemQuery(body) {
	let parsed = JSON.parse(body)
 			let passed = true
 			try{
 				// console.log(parsed)
 				if (parsed.rows.length === 0){
 						console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(parsed.original.queryNumber+" : No Results Found"))
 						return
 					}
 				// testing for single item return
 				if (parsed.rows.length === 1){
		 			for(Qobj in queryArray){
		 				if (parsed["error"] != undefined) {
		 					console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(Qobj+" : "+parsed.error))
		 					return
	 					}
		 				// Find expected response for this query
		 				if(queryArray[Qobj].query == parsed.original.query){
		 					if((parsed.rows[0].productId !== expectedResponseArray[Qobj][0].productId)){
		 						console.log(chalk.redBright.bgBlack('  \u03A7  ') +chalk.redBright(Qobj+" Failed mismatched productId"))
		 						passed = false
		 					}
		 					if((parsed.rows[0].usItemId !== expectedResponseArray[Qobj][0].usItemId)){
		 						console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(Qobj+" Failed mismatched usItemId"))
		 						passed = false
		 					}
		 					if((parsed.rows[0].title !== expectedResponseArray[Qobj][0].title)){
		 						console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(Qobj+" Failed mismatched title"))
		 						passed = false
		 					}
		 					if((parsed.rows[0].imageUrl !== expectedResponseArray[Qobj][0].imageUrl)){
		 						console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(Qobj+" Failed mismatched imageUrl"))
		 						passed = false
		 					}
		 					if((parsed.rows[0].price !== expectedResponseArray[Qobj][0].price)){
		 						console.log(chalk.redBright.bgBlack('  \u03A7  ')+chalk.redBright(Qobj+" Failed mismatched price"))
		 						passed = false
		 					}
		 					if (passed === true) {
		 						console.log(chalk.bold.greenBright.bgBlack('  \u2713  ')+chalk.bold.greenBright(Qobj+" Passed"))
		 					}
		 				}
		 			}
		 		}
		 		else if (parsed.rows.length > 1){

		 			// statsTester()
		 		}
	 		}
	 		catch(error){
	 			console.log(error)
	 			return
	 		}

}


function dbConnect(qString){
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




function createQueryArray() {
	return queryArray = {
		query1:{
			queryNumber:"query1",
			query:"Cokem International Preown 360 Halo: Combat Evolved Anniv", 
			searchType:"multipleItemSearch",
		},
		query2:{
			queryNumber:"query2",
			query:"Halo 3: ODST (Xbox 360)", 
			searchType:"multipleItemSearch",
		},
		query3:{
			queryNumber:"query3",
			query:"Xbox 360 Halo 3 (email delivery)", 
			searchType:"multipleItemSearch",
		},
		query4:{
			queryNumber:"query4 expected to fail with no results",
			query:"this query will fail the test", 
			searchType:"multipleItemSearch",
		},
		query5:{
			queryNumber:"query5 expected to fail with bad query type",
			query:"this query will fail the test", 
			searchType:"multipleItemSearch",
		},
		query6ExpectFail:{
			queryNumber:"query3",
			query:"Refurbished Microsoft Xbox 360 4gb Console Halo 3 and Halo 4 Bundle", 
			searchType:"multipleItemSearch",
		},
		query7MultipleItems:{
			queryNumber:"query3",
			query:"Halo", 
			searchType:"multipleItemSearch",
		}
	}
}





function createExpectedResponseArray() {
	return expectedResponseArray= {
		query1:[{ 
			productId: '5DVWGTJVZB5U',
			usItemId: '23109097',
			title: 'Cokem International Preown 360 Halo: Combat Evolved Anniv',
			imageUrl:
			'https://i5.walmartimages.com/asr/14eb2b8a-33cb-420c-8335-8e26e2ca986d_1.7c2e3255780b9b18c05845982cac',
			price: 37.17 
		}],
		query2:[{
			productId: '715DBQVKRIXS',
			usItemId: '10899773',
			title: 'Halo 3: ODST (Xbox 360)',
			imageUrl:
			'https://i5.walmartimages.com/asr/ca1bd3eb-c653-4f5d-9a8d-8c4dfe123fe6_1.6a1b2ca485395b18bb576f75a5ac',
			price: 19.95
		}],
		query3:[{
			productId: '30PFL94VDAUO',
			usItemId: '56208070',
			title: 'Xbox 360 Halo 3 (email delivery)',
			imageUrl:
			'https://i5.walmartimages.com/asr/6ced0869-a889-43d6-ad16-dd7bd78229ec_1.1785ebb4434a390ee1592b0f77e4',
			price: 19.99
		}],
		query4:[{
			expectFail:"expectFail"
		}],
		query5:[{
			expectFail:"expectFail"
		}],
		query6ExpectFail:[{
			productId: 'expectFail',
			usItemId: 'expectFail',
			title: 'expectFail',
			imageUrl:
			'expectFail',
			price: 0000
		}],
		query7MultipleItems:[{
			productId: '30PFL94VDAUO',
			usItemId: '56208070',
			title: 'Xbox 360 Halo 3 (email delivery)',
			imageUrl:
			'https://i5.walmartimages.com/asr/6ced0869-a889-43d6-ad16-dd7bd78229ec_1.1785ebb4434a390ee1592b0f77e4',
			price: 19.99
		}],

	}
}