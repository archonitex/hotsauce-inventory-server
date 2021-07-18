const express = require('express')
const cors = require('cors')
const https = require('https')
const http = require('http')
const fs = require('fs')
const morgan = require('morgan')

const db = require('./db')
const batchRouter = require('./routes/batch-router')
const userRouter = require('./routes/user-router')
const ingredientRouter = require('./routes/ingredient-router')

const app = express()

app.use(express.json({}));
app.use(express.urlencoded({extended: true}));

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(morgan('combined'));

app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', batchRouter)
app.use('/api', ingredientRouter)
app.use('/api', userRouter)
app.use(express.static(__dirname + '/public'));

const httpPort = 5000
const httpsPort = 5100

http.createServer(app).listen(httpPort, function(){
    console.log("HTTP server listening on port " + httpPort);
});

if(!process.argv.includes('dev')){
  var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/volamtarpeppers.wrclan.ca/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/volamtarpeppers.wrclan.ca/fullchain.pem'),
  };

  https.createServer(options, app).listen(httpsPort, function(){
    console.log("HTTPS server listening on port " + httpsPort);
  });
}
