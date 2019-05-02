const express = require('express');
const path = require('path');
const npmApp = express();

main()


// console.log(__dirname.split("/walmart_app")+"/build")
// var dirName = __dirname.split("/walmart_app")
// console.log(__dirname)

function main(argument) {
	// body...


const regex = /(.*\/walmart_app)/gm;
var m;
while ((m = regex.exec(__dirname)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    // console.log(typeof(m))


    npmApp.use(express.static(m[0]+"/build"));

npmApp.get('/', function(req, res) {
	res.sendFile(m[0]+"/build/index.html");
});

npmApp.listen(process.argv[2]);
}

    // console.log(m)



}