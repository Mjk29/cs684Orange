var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var itemTableName = "684Items"
var cartTableName = "684Cart"

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())


app.get('/', function (req, res) {
	console.log(req.query)
	qString = "SELECT productid, usItemId,  title FROM "+itemTableName+" WHERE title LIKE \'"+req.query.Query+"%\' ORDER BY hotness DESC"
	dbConnect(req,res, qString)
})

app.post('/', function (req, res) {
	console.log("Got a POST request for the homepage");
	// dbConnect(req,res)
	console.log(req.body )

	switch(req.body.searchType) {
		case "fullItemInfo":
			qString = "SELECT * FROM "+itemTableName+" WHERE productId='"+req.body.query.productId+"' AND usItemId='"+req.body.query.usItemId+"'"
			dbConnect(req,res, qString)
			break;
		case "autoCompleteSearchBar":
			qString = "SELECT productId, usItemId, title FROM "+itemTableName+" WHERE title LIKE \'%"+req.body.query+"%\' ORDER BY hotness DESC LIMIT 20"
			dbConnect(req,res, qString)
			break;
		case "multipleItemSearch":
			qString = "SELECT productId, usItemId, title, imageUrl, price FROM "+itemTableName+" WHERE title LIKE \'%"+req.body.query+"%\' ORDER BY hotness DESC LIMIT 50"
			dbConnect(req,res, qString)
			break;
		

		case "addItemToCart":
			// qString = "SELECT productId, usItemId, title, imageUrl, price FROM "+itemTableName+" WHERE title LIKE \'%"+req.body.query+"%\' ORDER BY hotness DESC LIMIT 50"
			console.log("add item to cart")
			console.log(req.body)

			qString = "INSERT INTO "+cartTableName+" (userEmail, productId, usItemId, quantity, `timestamp`) "
				+"VALUES('"+req.body.query.userEmail
				+"', '"+req.body.query.item.productId
				+"', '"+req.body.query.item.usItemId
				+"', '"+req.body.query.quantity
				+"', CURRENT_TIMESTAMP);"

			console.log(qString)
			dbConnect(req,res, qString)
			break;


// INSERT INTO ma995.`684Cart`
// (userEmail, productId, usItemId, quantity, `timestamp`)
// VALUES('', '', '', 0, CURRENT_TIMESTAMP);



		default:
			return
	} 


})



http.listen(5688, function(){
  console.log('listening on *:5688');
});






function dbConnect(req,res, qString){
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
	  if (err) throw err

	  console.log(rows)
	res.send(rows)
	})

	connection.end()
}




// autocomplete ideas
// user starts typing, after 3 characters the string is queried at the db
// sort by hotness
// hotnss is some metric of searches / period of time
// increasing hotnesscan be iterating the integer every time it is searched

// decreasing hotness can be completed by some amount for every x times some other search is completed?

// maybe sort by some timestamp field that gets updated every time the item is searched

// hotness = if last modified < 1 hour ago && item searched again, increase hotness by 1
// every x period of time, check items with a hotness of >x, if last checked > 1 hour, reduce hotness
// dont have to update whole table, only recently searched items. 