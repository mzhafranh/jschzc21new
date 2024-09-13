var express = require('express');
const { route } = require('./users');
var router = express.Router();

module.exports = function (db) {

  // const filter = {name: req.query.name,
  //   height: req.query.height,
  //   weight: req.query.weight,
  //   startDate: req.query.startDate,
  //   endDate: req.query.endDate,
  //   married: req.query.married,
  //   operation: req.query.operation
  // }


  router.get('/', function (req, res, next) {
    res.render('index');
  });

  router.get('/register', function (req, res, next) {
    res.render('register');
  });

  router.get('/test', async function (req, res, next) {

    const page = 1
    const pages = 1

    // const filter = {
    //   title: "Wululu",
    //   complete: '1',
    //   startDate: "2000-01-01",
    //   endDate: "2020-01-01",
    //   operation: "OR"
    // }

    const filter = {
      title: "",
      complete: '',
      startDate: "",
      endDate: "",
      operation: ""
    }

    const filterPage = `&page=1&title=Wululu&complete=1&startDate=2000-01-01&endDate=2020-01-01&operation=OR`
  
    let sql = 'SELECT * FROM todos';
  
    db.query(sql, (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log(data.rows);
      res.render('test', { rows: data.rows, pages, page, filter, filterPage })
    })
  });

  return router;
}
