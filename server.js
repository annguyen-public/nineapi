var express = require('express');
var app = express();
const NineGag = require('9gag');
const Scraper = NineGag.Scraper;

async function memes() {
    try {
        const scraper = new Scraper(1, 'kpop', 0);
    	const posts = await scraper.scrap();
    	console.log(posts);
    }
    catch (err) {
        console.log(err);
    }
}

/*var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});*/

var i = 0;
/*var myInt = setInterval(function () {
    i++;
}, 500);*/

app.get('/listUsers', function (req, res) {
	memes();
	res.end(JSON.stringify(i));
})

var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
