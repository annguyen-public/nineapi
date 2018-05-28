var express = require('express');
var app = express();
const db_name = 'nine_db';

const NineGag = require('9gag');
const Scraper = NineGag.Scraper;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://nineuser:123@ds133550.mlab.com:33550/" + db_name;


// nine fetcher
async function kpop(num) {
    try {
        const scraper = new Scraper(num, 'kpop', 0);
    	 const posts = await scraper.scrap();
        posts.forEach(post => updateDB('kpop', post));
    }
    catch (err) {
        console.log(err);
    }
}


// DB
function insertIfNotExist(collection, query, record){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(db_name);
    dbo.collection(collection).count(query, function(err, result) {
      if (err) throw err;
      if(result == 0){
          insertDB(collection, record);
      }
      db.close();
    });
  });

}

function findDB(collection, query){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(db_name);
    dbo.collection(collection).find(query, function(err, result) {
      if (err) throw err;
      console.log(result.name);
      db.close();
    });
  });
}

function orderByDate(collection){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(db_name);
    console.log("a");
    var mysort = { timestamp: -1 };
    dbo.collection(collection).find().limit(3).sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
    console.log("b");
  });
}

function insertDB(collection, record) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(db_name);

    dbo.collection(collection).insert(record, function(err, res) {
      if (err) throw err;
      console.log(record);
      db.close();
    });
  });
}

function updateDB(collection, record) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(db_name);
      var myquery = {'id': record.id};
      record.timestamp = new Date();
      dbo.collection(collection).update(myquery, record, { upsert: true }, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
      });
    });
}

kpop(200);
var myInt = setInterval(function () {
    kpop(2);
}, 300000);

app.get('/getKpopNewest', function (req, res) {
	orderByDate('kpop');
	res.end(JSON.stringify('OK'));
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
