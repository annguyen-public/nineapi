var express = require('express');
var app = express();
const db_name = 'nine_db';

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://nineuser:123@ds133550.mlab.com:33550/" + db_name;


// nine fetcher
async function kpop() {
    try {
        const scraper = new Scraper(100, 'kpop', 0);
    	const posts = await scraper.scrap();
      posts.forEach(post => insertDB('kpop', post));
    }
    catch (err) {
        console.log(err);
    }
}



// DB
function insertDB(collection, record) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(db_name);

    dbo.collection(collection).insertOne(record, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}


var myInt = setInterval(function () {
    kpop();
}, 300000);

/*app.get('/listUsers', function (req, res) {
	memes();
	res.end(JSON.stringify(i));
});*/

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
