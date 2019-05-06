var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')

const fetch = require('node-fetch');
var Promise = require('promise');
var async = require("async");


const https = require('https')


sender()



function sender() {


	const data = JSON.stringify({
		requestType: 'dispatchTransactionEmail',
		requestData: {txNumber: 100002}
	})

	const options = {
		hostname: 'web.njit.edu',
		port: 443,
		path: '/~mjk29/reactApp.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length
		}
	}

	const req = https.request(options, (res) => {
		console.log(`statusCode: ${res.statusCode}`)

		res.on('data', (d) => {
			process.stdout.write(d)
		})
	})

	req.on('error', (error) => {
		console.error(error)
	})

	req.write(data)
	req.end()


}





// serverTester()


// function serverTester(){
// console.log("TEsting")
// 		fetch('http://web.njit.edu/~mjk29/reactApp.php', {
// 			method: 'POST',
// 			// mode: "cors",
// 			// dataType: 'jsonp',
// 			// credentials: "same-origin", 
// 			// type:'POST',
// 			headers: {
// 				// Accept: 'application/json',
// 				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
// 			},
// 			body: JSON.stringify({
// 				ass:"asdasdasdasd"

// 			}),
// 		})
// 		.then(res => res.text())
// 		.then(body => {
//   			// testSingleItemQuery(body)
//   			console.log(body)
//  		})
// 		.catch(error => console.error('Error:', error))
	
// }