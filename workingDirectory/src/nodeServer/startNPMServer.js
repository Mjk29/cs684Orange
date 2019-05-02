const express = require('express');
const path = require('path');
const npmApp = express();


npmApp.use(express.static("/afs/cad.njit.edu/u/m/j/mjk29/reactApps/walmart_app/build"));

npmApp.get('/', function(req, res) {
	res.sendFile("/afs/cad.njit.edu/u/m/j/mjk29/reactApps/walmart_app/build/index.html");
});

npmApp.listen(process.argv[2]);