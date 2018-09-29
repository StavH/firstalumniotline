const _ = require('lodash');
const {
    ObjectID
} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
module.exports = {
    app
};