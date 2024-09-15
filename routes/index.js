var express = require('express');
const { route } = require('./users');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const helpers = require('../helpers/util')
var path = require('path');

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
    res.render('index', { info: req.flash('info') })
  });

  router.post('/', function (req, res, next) {
    const { email, password } = req.body
    // console.log('sampai sini')
        db.query('SELECT * FROM users WHERE email = $1', [email], (err, data) => {
          // console.log(data)
            if (err) return res.send(err)
            if (data.rows.length == 0) {
                req.flash('info', 'Email Not Registered')
                return res.redirect('/');
            }
            bcrypt.compare(password, data.rows[0].password, function (err, result) {
                if (err) return res.send(err)
                if (!result) {
                    req.flash('info', 'Password Incorrect')
                    return res.redirect('/');
                } else {
                  // console.log(data.rows[0])
                  req.session.user = data.rows[0]
                  res.redirect('/todos')
                }
            });
        })

  });

  router.get('/register', function (req, res, next) {
    res.render('register');
  });

  router.post('/register', function (req, res, next) {
    const { email, password, repassword } = req.body
    if (password != repassword) {
      return res.send("Password dan repassword berbeda")
    }
    db.query('SELECT * FROM users WHERE email = $1', [email], (err, data) => {
      if (err) return res.send(err)
      if (data.rows.length > 0) return res.send("Email sudah terdaftar")
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) return res.send(err)
        db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hash], (err) => {
          if (err) return res.send(err)
        })
        res.redirect('/')
      });
    })
  });

  router.get('/logout', helpers.isLoggedIn, function (req, res, next) {
    req.session.destroy((err) => {
        res.redirect('/')
    })
})

  router.get('/test', helpers.isLoggedIn, async function (req, res, next) {

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
