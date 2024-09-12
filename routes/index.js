var express = require('express');
const { route } = require('./users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = function (db) {

  return router;
}
