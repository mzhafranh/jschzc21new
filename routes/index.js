var express = require('express');
var router = express.Router();

// module.exports = router;
module.exports = function (db) {

  function add(name, height, weight, birthdate, married, callback) {
    db.run('INSERT INTO data (name, height, weight, birthdate, married) VALUES (?, ?, ?, ?, ?)', [name, height, weight, birthdate, married], (err) => {
      callback(err);
    });
  }

  function select(id, callback) {
    db.all('SELECT * FROM data WHERE id = ?', [id], (err, data) => {
      // console.log(data)
      callback(err, data);
    })
  }

  function update(id, name, height, weight, birthdate, married, callback) {
    db.run('UPDATE data SET name = ?, height = ?, weight = ?, birthdate = ?, married = ? WHERE id = ?', [name, height, weight, birthdate, married, id], (err) => {
      callback(err);
    });
  }

  function remove(id, callback) {
    db.run('DELETE FROM data WHERE id = ?', [id], (err) => {
      callback(err);
    })
  }

  /* GET home page. */
  router.get('/', function (req, res, next) {
    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const wheres = []
    const values = []
    const filterPageArray = []
    var filterPage = ``
    // const filterPage = `&name=${req.query.name}&height=${req.query.height}&weight=${req.query.weight}&startDate=${req.query.startDate}&endDate=${req.query.endDate}&married=${req.query.married}&operation=${req.query.operation}`
    const filter = {name: req.query.name,
      height: req.query.height,
      weight: req.query.weight,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      married: req.query.married,
      operation: req.query.operation
    }

    if (req.query.name) {
        wheres.push(`name like '%' || ? || '%'`);
        values.push(req.query.name);
        filterPageArray.push(`&name=${req.query.name}`)
    }

    if (req.query.height) {
        wheres.push(`height = ?`);
        values.push(req.query.height);
        filterPageArray.push(`&height=${req.query.height}`)
    }

    if (req.query.weight) {
        wheres.push(`weight = ?`);
        values.push(req.query.weight);
        filterPageArray.push(`&weight=${req.query.weight}`)
    }

    if (req.query.startDate || req.query.endDate ) {
        if (req.query.startDate && req.query.endDate) {
            wheres.push('birthdate BETWEEN ? AND ?')
            values.push(req.query.startDate);
            values.push(req.query.endDate);
            filterPageArray.push(`&startDate=${req.query.startDate}`)
            filterPageArray.push(`&endDate=${req.query.endDate}`)
        }
        else if (req.query.startDate) {
            wheres.push('birthdate >= ?')
            values.push(req.query.startDate);
            filterPageArray.push(`&startDate=${req.query.startDate}`)
        }
        else if (req.query.endDate) {
            wheres.push('birthdate <= ?')
            values.push(req.query.endDate);
            filterPageArray.push(`&endDate=${req.query.endDate}`)
        }
    }

    if (req.query.married) {
        wheres.push(`married = ?`);
        values.push(req.query.married);
        filterPageArray.push(`&married=${req.query.married}`)
    }

    if (req.query.operation){
      filterPageArray.push(`&operation=${req.query.operation}`)
    }
    else {
      filterPageArray.push(`&operation=OR`)
    }

    let sql = 'SELECT COUNT(*) AS total FROM data';
    if (wheres.length > 0) {
      if (req.query.operation == 'OR'){
        sql += ` WHERE ${wheres.join(' OR ')}`
      } else if (req.query.operation == 'AND'){
        sql += ` WHERE ${wheres.join(' AND ')}`
      }
    }

    // console.log(sql)
    // console.log(values)
    // console.log(wheres)

    db.all(sql, values, (err, data) => {
        if (err) {
            console.error(err);
        }
        // console.log(data)
        const pages = Math.ceil(data[0].total / limit)
        sql = 'SELECT * FROM data'
        if (wheres.length > 0) {
          if (req.query.operation == 'OR'){
            sql += ` WHERE ${wheres.join(' OR ')}`
          } else if (req.query.operation == 'AND'){
            sql += ` WHERE ${wheres.join(' AND ')}`
          }
        }
        sql += ' LIMIT ? OFFSET ?'
        filterPage += filterPageArray.join('')
        db.all(sql, [...values, limit, offset], (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(page, pages)
            console.log(parseInt(page) === pages)
            res.render('index', { rows: data, pages, page, filter, filterPage })
        })
    })

  });

  router.get('/add', (req, res) => {
    res.render('add')
  })

  router.post('/add', (req, res) => {
    add(req.body.name, parseInt(req.body.height), parseFloat(req.body.weight), req.body.birthdate, req.body.married, (err) => {
      if (err) {
        console.error(err);
      }
    })
    res.redirect('/');
  })

  router.get('/edit/:id', (req, res) => {
    select(parseInt(req.params.id), (err, data) => {
      if (err) {
        console.error(err);
      }
      // console.log(data[0])
      res.render('edit', { item: data[0] })
    })
  })

  router.post('/edit/:id', (req, res) => {
    update(parseInt(req.params.id), req.body.name, parseInt(req.body.height), parseFloat(req.body.weight), req.body.birthdate, req.body.married, (err) => {
      if (err) {
        console.error(err)
      }
      res.redirect('/');
    })
  })

  router.get('/delete/:id', (req, res) => {
    const index = parseInt(req.params.id)
    remove(index, (err) => {
        if (err) {
            console.error(err);
        }
    })
    res.redirect('/');
  })



  return router;
}