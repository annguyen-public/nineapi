var express = require('express');
var app = express();
const db_name = 'nine_db';

const NineGag = require('9gag');
const Scraper = NineGag.Scraper;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://nineuser:123@ds133550.mlab.com:33550/" + db_name;

var http = require('http');


var intagram_u = ["mienguyen", "trammanhhh305", "manttien", "hoaiann_", 
"celinefarach", "mollyomalia", "loren", "jhulia_pimentel", "megan.frey", 
"ribisachi", "salimhwg", "imkhangan", "ngocthao_official", "quynhanhshyn_", "chipupu", 
"gaixinh.vn", "teengirlsvn", "gaixinh.official", "hoingamgaixinh", "linh.lt98"];

var ninePage = ["kpop", "girl"];
//var intagram_u = ["mienguyen"];


// nine fetcher
async function ninegag(collection, num) {
    try {
        const scraper = new Scraper(num, collection, 0);
    	 const posts = await scraper.scrap();
        posts.forEach(post => updateDB(collection, post));
    }
    catch (err) {
        console.log(err);
    }
}

function intagram(user_name, count){
  var options = {
    host: 'intascraper.herokuapp.com',
    port: 80,
    path: '/examples/getAccountMediasByUsername.php?u=' + user_name + '&c=' + count
  };

  http.get(options, function(res) {
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        try{
          var response = JSON.parse(body);
          for (var i = 0; i < response.length; i++) {          
            response[i].user_name = user_name;
            updateDB('intagram', response[i]);
          }
        }
        catch(e)
        {console.log(e);}
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
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

async function orderByDate(collection){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(db_name);
    var mysort = { timestamp: -1 };
    dbo.collection(collection).find().limit(3).sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      return result;
      db.close();
    });
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

//ninegag('kpop',200);
//ninegag('girl',200);
/*var myInt = setInterval(function () {
    ninegag('kpop',200);
    ninegag('girl',200);
}, 600000);

var feedInta = setInterval(function () {
  for (var i = 0; i < intagram_u.length; i++) {
    intagram(intagram_u[i], 50);
  }
}, 600000);*/

function scrapeNine(){
  for (var i = 0; i < ninePage.length; i++) {
    ninegag(ninePage[i],200);
  }
}

function scrapeInsta(){
  for (var i = 0; i < intagram_u.length; i++) {
    intagram(intagram_u[i], 50);
  }
}

app.get('/scrapeNow', function (req, res) {
  try{
    scrapeNine();
    scrapeInsta();
  }
  catch(e){
    console.log(e);
  }
  res.end('OK');
});

/*var autoping = setInterval(function () {
  var options = {
    host: 'fetchvuivuidata.herokuapp.com',
    port: 80,
    path: '/'
  };

  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);

    res.on("data", function(chunk) {
      console.log("BODY: " + chunk);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}, 900000);*/

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("scrape bot http://%s:%s", host, port)

})
