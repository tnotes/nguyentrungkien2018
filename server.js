const express = require('express');
const app = express();
const routeIn = require('./route/routeIn');
const routeOut = require('./route/routeOut');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/api',routeIn);
app.use('/',routeOut);

app.listen(80);