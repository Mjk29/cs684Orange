var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var itemTableName = "684Items"
var cartTableName = "684Cart"
// const process = require('process');

// console.log(process.argv[2])


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())

http.listen(process.argv[2], function(){
  console.log('listening on '+process.argv[2]);
});




app.get('/', function (req, res) {
	console.log(req.query)
	qString = "SELECT productid, usItemId,  title FROM "+itemTableName+" WHERE title LIKE \'"+req.query.Query+"%\' ORDER BY hotness DESC"
	dbConnect(req,res, qString)
})

app.post('/', function (req, res) {
	// console.log("Got a POST request for the homepage");
	// dbConnect(req,res)
	// console.log(req )

	switch(req.body.searchType) {
		case "fullItemInfo":
			qString = "SELECT * FROM "+itemTableName+" WHERE productId='"+req.body.query.productId+"' AND usItemId='"+req.body.query.usItemId+"'"
			dbConnect(req,res, qString, req.body)
			break;
		case "autoCompleteSearchBar":
			qString = "SELECT productId, usItemId, title FROM "+itemTableName+" WHERE title LIKE \'%"+req.body.query+"%\' ORDER BY hotness DESC LIMIT 20"
			dbConnect(req,res, qString, req.body)
			break;
		case "multipleItemSearch":
			qString = "SELECT productId, usItemId, title, imageUrl, price FROM "+itemTableName+" WHERE title LIKE \'%"+req.body.query+"%\' ORDER BY hotness DESC LIMIT 100"
			dbConnect(req,res, qString, req.body)
			break;
		

		case "addItemToCart":
			// qString = "SELECT productId, usItemId, title, imageUrl, price FROM "+itemTableName+" WHERE title LIKE \'%"+req.body.query+"%\' ORDER BY hotness DESC LIMIT 50"
			// console.log("add item to cart")
			// console.log(req.body)

			// qString = "INSERT INTO "+cartTableName+" (userEmail, productId, usItemId, quantity, `timestamp`) "
			// 	+"VALUES('"+req.body.query.userEmail
			// 	+"', '"+req.body.query.item.productId
			// 	+"', '"+req.body.query.item.usItemId
			// 	+"', '"+req.body.query.quantity
			// 	+"', CURRENT_TIMESTAMP);"

			qString = "CALL addItemToCart('"+req.body.query.userEmail
					+"', '"+req.body.query.item.productId
					+"', '"+req.body.query.item.usItemId
					+"', '"+req.body.query.quantity+"');"
			// console.log(qString)
			dbConnect(req,res, qString, req.body)
			break;

		case "modifyCartToken":
			// qString	= 	"UPDATE "+cartTableName
			// 			+" SET userEmail='"+req.body.query.authEmail
			// 			+"' WHERE userEmail='"+req.body.query.tempToken
			// 			+"';"
			// qString=
			// 	"START TRANSACTION; "
			// 	+"insert into "+cartTableName+" (userEmail, productId, usItemId, quantity, timestamp) "
			// 	+"select '"+req.body.query.authEmail+"', productId, usItemId, quantity, timestamp "
			// 	+"from "+cartTableName+" o "
			// 	+"where o.userEmail = '"+req.body.query.tempToken+"' "
			// 	+"on duplicate key update quantity = o.quantity + "
			// 	+"(SELECT quantity from "+cartTableName+" where "+cartTableName+".userEmail = '"+req.body.query.authEmail+"'); "
			// 	+"delete from "+cartTableName+" "
			// 	+"where "+cartTableName+".userEmail = '"+req.body.query.tempToken+"'; "
			// 	+"COMMIT;"
			qString = "CALL modifyCartToken('"+req.body.query.authEmail+"', '"+req.body.query.tempToken+"');"
			// console.log(qString)
			dbConnect(req,res, qString, req.body)
			break

		case "fetchCartItems":
			// qString=	"SELECT * FROM "+cartTableName
			// 			+" WHERE userEmail='"+req.body.query+"';"
			qString = 	"SELECT "	
						+cartTableName+".productID, "
						+cartTableName+".usItemId, "
						+cartTableName+".quantity, "
						+itemTableName+".price, "
						+itemTableName+".imageUrl, "
						+itemTableName+".title "
						+"FROM "+itemTableName+" INNER JOIN "+cartTableName
						+" ON "+itemTableName+".productId = "+cartTableName+".productID"
						+" WHERE "+cartTableName+".userEmail = '"+req.body.query+"';"
			// console.log(qString)
			try{
				returnMsg = dbConnect(req,res, qString, req.body)
				// console.log(returnMsg)
			}
			catch(error){
				// console.log("there was an error")
				// console.log(error)
			}
			break

		case "removeItemFromCart":
			qString = "DELETE FROM "+cartTableName+" "
				+"WHERE userEmail='"+req.body.query.userEmail+"' "
				+"AND productId='"+req.body.query.productId+"' "
				+"AND usItemId='"+req.body.query.usItemId+"';"
				// console.log(qString)
			dbConnect(req,res, qString, req.body)
			break



		case "checkoutItems":
			console.log(req.body.query)
			qString = "CALL createTransactions('"+req.body.query+"');"
			dbConnect(req,res, qString, req.body)
			break



		default:
			res.send(JSON.stringify({error:"bad query type",}))
			return
	} 


})






function dbErrorHandler(returnedErrorMessage, originalBody, res,req){
	// console.log("handlingDupoesincart")
	// console.log(returnedErrorMessage.errno)
	// console.log(originalBody)
	// console.log("=--------------------------------------=")


	switch(returnedErrorMessage.errno){
		case 1062:
			// console.log("duplicate cart entry")
				// console.log(originalBody)
				if (originalBody.searchType == "modifyCartToken") {return}
				qString = "UPDATE "+cartTableName
					+" SET quantity = quantity + "+originalBody.query.quantity+" "
					+"WHERE userEmail='"+originalBody.query.userEmail
					+"' AND productId='"+originalBody.query.item.productId
					+"' AND usItemId='"+originalBody.query.item.usItemId+"';"
				// console.log(qString)
				dbConnect(req,res, qString, originalBody)
				return
		default:
			// console.log(returnedErrorMessage)
			return

	}

}



var counter = 0;



function dbConnect(req,res, qString, originalBody){
	// console.log("db function")
	// console.log(qString)
	console.log("got request #"+counter++)
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
 		// console.log(err)
 		dbErrorHandler(err, originalBody, res, req)
 		return

	}

	// console.log(rows)
	// console.log(originalBody)
	res.send(JSON.stringify({rows:rows, original:originalBody}))
	// res.send(rows)
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