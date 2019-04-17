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

console.log(chalk.blue('Hello') + ' World' + chalk.red('!'));

	var queryArray = {
		query1:{
			query:"Cokem International Preown 360 Halo: Combat Evolved Anniv", 
			searchType:"multipleItemSearch",
			yieldAction:"FETCHED_MULTIPLE_ITMES"
		},
		query2:{
			query:"Halo 3: ODST (Xbox 360)", 
			searchType:"multipleItemSearch",
			yieldAction:"FETCHED_MULTIPLE_ITMES"
		},
		query3:{
			query:"Xbox 360 Halo 3 (email delivery)", 
			searchType:"multipleItemSearch",
			yieldAction:"FETCHED_MULTIPLE_ITMES"
		}
	}


	var expectedResponseArray = {
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

	}




 	serverTester(queryArray, expectedResponseArray)

	// for (Q in queryArray){
	// 	let serverResponse =   serverTester(queryArray[Q])
	// }



}



function serverTester(queryArray, expectedResponseArray){
	var returnedA = []
	for(Q in queryArray){
		// console.log(Q)

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
				query:queryArray[Q].query
			}),
		})
		.then(res => res.text())
		.then(body => {
 			let parsed = JSON.parse(body)
 			let passed = true
 			for(Qobj in queryArray){
 				// Find expected response for this query
 				if(queryArray[Qobj].query == parsed.original.query){
 					// console.log(parsed.rows[0].productId)
 					// console.log(expectedResponseArray[Qobj][0].title)
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
 						console.log(chalk.bold.greenBright.bgBlack('  \u2713  ') +chalk.bold.greenBright(Qobj+" Passed"))
 					}




 				}
 			}

 		});

	}


}


// productId: '5DVWGTJVZB5U',
//     usItemId: '23109097',
//     title: 'Cokem International Preown 360 Halo: Combat Evolved Anniv',
//     imageUrl:

// create some container for test queries
// create some container for expected responses
// execute query and check if given correct response







function stringGenerator(req){
	switch(req.searchType) {
		case "fullItemInfo":
			qString = "SELECT * FROM "+itemTableName+" WHERE productId='"+req.query.productId+"' AND usItemId='"+req.query.usItemId+"'"
			dbConnect(qString)
			break;
		case "autoCompleteSearchBar":
			qString = "SELECT productId, usItemId, title FROM "+itemTableName+" WHERE title LIKE \'%"+req.query+"%\' ORDER BY hotness DESC LIMIT 20"
			dbConnect(qString)
			break;
		case "multipleItemSearch":
			qString = "SELECT productId, usItemId, title, imageUrl, price FROM "+itemTableName+" WHERE title LIKE \'%"+req.query+"%\' ORDER BY hotness DESC LIMIT 50"
			dbConnect(qString)
			break;
}
}




		











function dbConnect(qString){
	console.log("db function")
	console.log(qString)
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
  		// dbErrorHandler(err, originalBody, res, req)
 		return
	}
	console.log(rows)
	// res.send(rows)
	})
	connection.end()
}

