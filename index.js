var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser());

var pg = require('pg');

app.get('/', function(req,res){
  res.render('formPage');
});

var connectionString = "postgres://" + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

app.get('/messages', function(req,res){
  pg.connect(connectionString, function(err,client,done){
    if (err){
      return console.log("errorConnecting");
    }
    client.query('select * from messages', function(err, result){
      if (err){
        return console.log("errorGettingMessages");
      }
      res.render("messagePage", result);
      done();
      pg.end();
    });
  });
});

app.get('/write', function(req,res){
  res.redirect("/");
});

app.post('/write', function(req,res){
  pg.connect(connectionString, function(err,client,done){
    if (err){
      return console.log("errorPosting");
    }
    client.query("insert into messages (title, body) values ('" + req.body.title + "','" + req.body.body + "');", function(err, result){
      if (err){
        return console.log("errorWriting");
      }
      res.redirect("/messages");
    });
  });
});

app.listen('3000', function(){
  console.log("listening on port 3000");
});
