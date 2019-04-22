var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var itemTableName = "684Items"
var cartTableName = "684Cart"
const fetch = require('node-fetch');
var Promise = require('promise');
var async = require("async");
const chalk = require('chalk');


main()

function main(){
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



function serverTester(queryArray, expectedResponseArray){
	var returnedA = []
	for(Q in queryArray){

		fetch('http://afsconnect1.njit.edu:5688', {
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
		 			console.log(parsed)
		 		}
		 		// testing for multiple item return


	 		}
	 		catch(error){
	 			console.log(error)
	 			return
	 		}

 		})
		.catch(error => console.error('Error:', error))
	}


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