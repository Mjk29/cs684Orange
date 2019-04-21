var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser')
var itemTableName = "684Items"
var cartTableName = "684Cart"


const { exec } = require('child_process');

exec('npm -v => testr.txt', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }

  console.log(`>> ${stdout}`);
});
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.use(bodyParser.json())

// http.listen(5677, function(){
// 	console.log('listening on *:5677');
// });


// app.get('/', function (req, res) {
// 	// res.writeHead(302,  {Location: "http://127.0.0.1:5000"})
// 	// res.end();

	
// })
