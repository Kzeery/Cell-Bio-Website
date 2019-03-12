var express = require("express");
var app = express();
var path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
    res.render("webpagecv");
});



app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server has started!");
});