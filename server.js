//------------------------------------------------
// lib
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const path = require('path');

const http = require('http').Server(app);

const port = 3000;

console.log(`>>>>>>>>>>>>>>> ${port}`);

var corsOptions = {
	origin: '*',
	credentials: true,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
	bodyParser.json({
		limit: '50mb',
	})
);

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(require(`${__dirname}/middleware/db`).db);

//------------------------------------------------
// route
// app.use(uploadFilePath, express.static(path.join(__dirname + uploadFilePath)));
app.use('/', require(`${__dirname}/route/base`)); // default

// app.use(express.static(__dirname + '/public'));

app.disable("x-powered-by");

app.get('/', async function (req, res) {
	res.send('cardealer app server On');
});

http.listen(port);