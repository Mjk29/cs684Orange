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
const { exec } = require('child_process');
var fs = require('fs');
const https = require('https')






end2end()


function end2end() {
	console.log(chalk.green("starting end to end test"))

	// check if able to connect to react server
	connectionTester("https://web.njit.edu/~mjk29/reactApp.php") 
	.then((data)=>{
		var req = data.split("/?")
		var serverObj = JSON.parse(req[1])
		var serverAddress = "http://"+serverObj.serverAddress+":"+serverObj.serverPort
		console.log(serverAddress)
// check if able to connect to node server
		fetchURLInfo(serverAddress)
			.then((data)=>{
				if(data.output.split("\r\n")[0].split(' ')[1] === "200"){
// nodeServer reachable
					console.log(chalk.bold.greenBright.bgBlack('  \u2713  ')+chalk.bold.greenBright(` Passed : nodeServer reachable`))
				}
				else{
					console.log(chalk.bold.redBright.bgBlack('  \u03A7  ')+chalk.bold.redBright(` Failed : connection to nodeServer`))
				}
				
// search for items
				var queryArray = createQueryArray();
				var expectedResponseArray = createExpectedResponseArray()
				var testList=[]

			
				for (var i = 0; i < queryArray.length; i++) {
					testList.push({qa:queryArray[i], er:expectedResponseArray[i], sa:serverAddress})
				}

				var promises = testList.map(testCase => serverTester(testCase));
				Promise.all(promises)
					.catch((data)=>{
						console.log(data)
						console.log(chalk.red("ERROR"))
					})
					.then((data)=>{
// verify Items
						var itemsPass = testSingleItemQuery(data, expectedResponseArray)
						if (itemsPass === true) {
// add items to cart
						var addList = []
						for (var i = 0; i < data.length; i++) {
							addList.push({item:JSON.parse(data[i]).rows[0], sa:serverAddress})
						}
						// console.log(addList)
						var promises = addList.map(testCase => addItemsToCart(testCase, "testEmail@test.test"));
						Promise.all(promises)
							.catch((data)=>{
								console.log(data)
								console.log(chalk.red("ERROR"))
							})
							.then((data)=>{
// verify added items
								// console.log(data)
// checkout
								checkoutItems(serverAddress, "testEmail@test.test")
								.then((data)=>{
									console.log(JSON.parse(data).rows)
								})
							})
						}
					})
					
			
		})

	})
// {"rows":[[{"txNumber":100056}],{"fieldCount":0,"affectedRows":0,"insertId":0,"serverStatus":34,
// "warningCount":0,"message":"","protocol41":true,"changedRows":0}],
// "original":{"searchType":"checkoutItems","query":"testEmail@test.test"}}



// {"rows":[[{"txNumber":100057}],{"fieldCount":0,"affectedRows":0,"insertId":0,"serverStatus":34,
// "warningCount":0,"message":"","protocol41":true,"changedRows":0}],
// "original":{"searchType":"checkoutItems","query":"testEmail@test.test2"}}

		
	
	// loop
		// search for items
		// add items to cart
	// check if db cart contains correct items
	// checkout
	// check if tx table contains transaction
}



function checkoutItems(serverAddress, userEmail) {
	// console.log(userEmail)
	return new Promise((resolve, reject)=>{
			fetch(serverAddress, {
				method: 'POST',
				mode: "cors",
				dataType: 'jsonp',
				credentials: "same-origin", 
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					searchType: "checkoutItems",
					query:userEmail
				}),
			})
			.then(res => res.text())
			.then(body => {
				resolve(body)
	 		})
			.catch(error => reject('Error:', error))
	})
}



function addItemsToCart(obj, userEmail) {
	return new Promise((resolve, reject)=>{
		var returnedA = []
			fetch(obj.sa, {
				method: 'POST',
				mode: "cors",
				dataType: 'jsonp',
				credentials: "same-origin", 
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					searchType: "addItemToCart",
					query:{
						item:{
							productId:obj.item.productId,
							usItemId:obj.item.usItemId
						}, 
						quantity:7,
						userEmail:userEmail,
					}
				}),
			})
			.then(res => res.text())
			.then(body => {
				resolve(body)
	 		})
			.catch(error => reject('Error:', error))
	})
}



function serverTester(obj){
	return new Promise((resolve, reject)=>{
		var returnedA = []
		// for(Q in queryArray){
			fetch(obj.sa, {
				method: 'POST',
				mode: "cors",
				dataType: 'jsonp',
				credentials: "same-origin", 
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					searchType: obj.qa.searchType,
					query:obj.qa.query,
					queryNumber:obj.qa.queryNumber,

				}),
			})
			.then(res => res.text())
			.then(body => {
				// console.log(chalk.blue(body))
				// testSingleItemQuery(body)
				resolve(body)
	 		})
			.catch(error => reject('Error:', error))
		// }
		// resolve("ASd")
	})
}









function connectionTester(address) {
	return new Promise((resolve)=> {
		fetchURLInfo(address)
		.catch((data)=>{
			console.log(chalk.bold.redBright.bgBlack('  \u03A7  ')+chalk.bold.redBright(` Failed : Fetch from PHP Page`))
			return
		})
		.then((data)=>{		
			let redirectHeader = data.output.split("\r\n")
			let masterServer = redirectHeader[8].split(' ')[1]
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
						resolve(slaveServerDecoded)
					}
					else{
						console.log(chalk.bold.redBright.bgBlack('  \u2713  ')+chalk.bold.redBright(` Failed : ${slaveServerDecoded}`))
						resolve(0)
					}

				})
			})
		})
		})
	
}



function fetchURLInfo(address) {
	return new Promise((resolve, reject) =>{
		var parsedArray = []
		exec(`curl ${address} -I`, (err, cmdOutput, stderr) => {
			if (err){	
				console.log("fetch error")
				console.log(err)
				reject({error:err})		
			}
			else{	
 				resolve({output:cmdOutput})	
			}
		});
	})
}














function testSingleItemQuery(body, expected) {
	var fullPass = true
	for (var i = 0; i < body.length; i++) {
		let parsed = JSON.parse(body[i])

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
	 		if (passed === false){
	 			fullPass = false
	 		}
	 		return fullPass
	 	}

}






function createQueryArray() {
	return queryArray = [
		{
			queryNumber:"query1",
			query:"Cokem International Preown 360 Halo: Combat Evolved Anniv", 
			searchType:"multipleItemSearch",
		},
		{
			queryNumber:"query2",
			query:"Halo 3: ODST (Xbox 360)", 
			searchType:"multipleItemSearch",
		},
		{
			queryNumber:"query3",
			query:"Xbox 360 Halo 3 (email delivery)", 
			searchType:"multipleItemSearch",
		},
		{
			queryNumber:"query4",
			query:"HALO Reach, Microsoft, Xbox 360, 885370230659", 
			searchType:"multipleItemSearch",
		},
		{
			queryNumber:"query5",
			query:"Microsoft Halo MasterChief Collection (Xbox One)", 
			searchType:"multipleItemSearch",
		},
		{
			queryNumber:"query3",
			query:"Refurbished Microsoft Xbox 360 4gb Console Halo 3 and Halo 4 Bundle", 
			searchType:"multipleItemSearch",
		},
		{
			queryNumber:"query7",
			query:"Microsoft Halo 3 Odst (Xbox 360) - Pre-Owned", 
			searchType:"multipleItemSearch",
		}
	]
}



function createExpectedResponseArray() {
	return expectedResponseArray= [
		[{ 
			productId: '5DVWGTJVZB5U',
			usItemId: '23109097',
			title: 'Cokem International Preown 360 Halo: Combat Evolved Anniv',
			imageUrl:
			'https://i5.walmartimages.com/asr/14eb2b8a-33cb-420c-8335-8e26e2ca986d_1.7c2e3255780b9b18c05845982cac',
			price: 37.17 
		}],
		[{
			productId: '715DBQVKRIXS',
			usItemId: '10899773',
			title: 'Halo 3: ODST (Xbox 360)',
			imageUrl:
			'https://i5.walmartimages.com/asr/ca1bd3eb-c653-4f5d-9a8d-8c4dfe123fe6_1.6a1b2ca485395b18bb576f75a5ac',
			price: 19.95
		}],
		[{
			productId: '30PFL94VDAUO',
			usItemId: '56208070',
			title: 'Xbox 360 Halo 3 (email delivery)',
			imageUrl:
			'https://i5.walmartimages.com/asr/6ced0869-a889-43d6-ad16-dd7bd78229ec_1.1785ebb4434a390ee1592b0f77e4',
			price: 19.99
		}],
		[{
			productId: '3MGWZT694902',
			usItemId: '25866521',
			title: 'HALO Reach, Microsoft, Xbox 360, 885370230659',
			imageUrl:
			'https://i5.walmartimages.com/asr/c3b32348-1319-4e03-a2cf-3620230ef60a_1.a97d9e068b44a0002458fb20cc70',
			price: 23.35
		}],
		[{
			productId: '1N0JE086PX4Y',
			usItemId: '39507641',
			title: 'Microsoft Halo MasterChief Collection (Xbox One)',
			imageUrl:
			'https://i5.walmartimages.com/asr/125ac46a-4d70-4931-9e5a-ab6715318c45_1.4a11613007edfe3be892a2630c85',
			price: 28.45
		}],
		[{
			productId: '4K3F0S4FFLOO',
			usItemId: '676579682',
			title: 'Refurbished Microsoft Xbox 360 4gb Console Halo 3 and Halo 4 Bundle',
			imageUrl:
			'https://i5.walmartimages.com/asr/3d1e4cfb-9c18-44ed-bb30-c43a5c501519_1.43ead1156eeeb115f5589835bee5',
			price: 118.99
		}],
		[{
			productId: '7CX49GAR9Y5D',
			usItemId: '23736059',
			title: 'Microsoft Halo 3 Odst (Xbox 360) - Pre-Owned',
			imageUrl:
			'https://i5.walmartimages.com/asr/2acb4a61-3138-4a8b-a282-0a4eefb195da_1.ce0dc07f6c890bfeff273aaaf617',
			price: 13.83
		}],
	]
}

