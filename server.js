var express = require('express');
var app = express();
const NineGag = require('9gag');
const Scraper = NineGag.Scraper;

async function memes() {
    const scraper = new Scraper(10);
    try {
        const posts = await scraper.scrap();
        posts.forEach(post => console.log(`${post.title} -> ${post.content}`));
    }
    catch (err) {
        console.log(err);
    }
}
var i = 0;
var myInt = setInterval(function () {
    i++;
}, 500);

app.get('/listUsers', function (req, res) {
	memes();
	res.end(JSON.stringify(i));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})