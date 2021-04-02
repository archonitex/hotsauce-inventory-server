const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const https = require('https')
const http = require('http')
const fs = require('fs')
const morgan = require('morgan')

const db = require('./db')
const batchRouter = require('./routes/batch-router')
const ingredientRouter = require('./routes/ingredient-router')

var options = {
    key: fs.readFileSync('/home/archon/letsencrypt/config/live/volamtarpeppers.wrclan.ca/privkey.pem'),
    cert: fs.readFileSync('/home/archon/letsencrypt/config/live/volamtarpeppers.wrclan.ca/fullchain.pem'),
};

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/api', batchRouter)
app.use('/api', ingredientRouter)

app.use(morgan('combined'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const httpPort = 3000
const httpsPort = 3001

http.createServer(app).listen(httpPort, function(){
    console.log("HTTP server listening on port " + httpPort);
});

https.createServer(options, app).listen(httpsPort, function(){
    console.log("HTTPS server listening on port " + httpsPort);
  });