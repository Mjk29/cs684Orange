var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello World');
})

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

app.use(express.json());



app.post('/', function (req, res) {
	console.log("Got a POST request for the homepage");
	console.log(req.body.actorName)
	console.log(req.body.actorType)
	sendData = dbConnect(req,res);
	console.log("sendData")
})



var server = app.listen(1337, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})




function tester() {
	var myObj = {name: "John", age: 69, city: "New York"};
	var myJSON = JSON.stringify(myObj);
	return myJSON
}




function dbConnect(req,res){
	var Client = require('mariasql');
 
	var c = new Client({
	  host: '127.0.0.1',
	  user: 'root',
	  password: 'Matt5687'
	});


	// queryString = 'SELECT * FROM dnd_testDB.'+req.body.actorType+'Data WHERE actorName = "'+req.body.actorName+'"'
	// queryString = 'SELECT * FROM dnd_testDB.monsterStats'
	console.log(req.body.queryString)

	c.query(req.body.queryString, function(err, result, fields) {
		if (err)
			throw err;
		// console.dir(rows);
		// return rows
		console.log(result)
		res.send(result);
		return result


	});
	

	c.end();



}





// var http = require('http'),
//     ajaxResponse = { 'hello': 'world' },
//     htmlContent;

// htmlContent  = "<html><title></title><head>";
// htmlContent += "<script src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>";
// htmlContent += "<script>$(function() {$.ajax({url:'/ajax',success:function(data){alert('success!');console.log(data);},error:function(data){alert('error!');}});});</script>";
// htmlContent += "</head><body><h1>Hey there</h1>";
// htmlContent +="</body></html>";

// http.createServer(function (req, res) {   
//   if (req.url === '/ajax') {
//     res.writeHead(200, {'Content-Type': 'text/json'});
//     res.end(JSON.stringify(ajaxResponse));
//   } else {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end(htmlContent);  
//   }  
// }).listen(1337, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:1337/');

// var http = require('http');

// http.createServer(function (req, res) {
//     console.log('request received');
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('_testcb(\'{"message": "Hello world!"}\')');
// }).listen(8124);


// var http = require('http');
// var util = require('util')
// http.createServer(function (req, res) {

//     console.log('Request received: ');
//     util.log(util.inspect(req)) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
//     util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url

//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     req.on('data', function (chunk) {
//         console.log('GOT DATA!');
//     });
//     res.end('callback(\'{\"msg\": \"OK\"}\')');

// }).listen(3000);
// console.log('Server running on port 3000');







// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))





// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });