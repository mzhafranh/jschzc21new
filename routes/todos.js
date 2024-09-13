var express = require('express');
var router = express.Router();

// module.exports = router;
module.exports = function (db) {

  function add(title, complete, deadline, userid, callback) {
    db.query('INSERT INTO todos (title_column, complete_column, deadline_column, userid_column) VALUES ($1, $2, $3, $4)', [title, complete, deadline, userid], (err) => {
      callback(err);
    });
  }

  function select(id, callback) {
    db.query('SELECT * FROM todos WHERE id = $1', [id], (err, data) => {
      // console.log(data)
      callback(err, data);
    })
  }

  function update(title, complete, deadline, userid, id, callback) {
    db.query('UPDATE todos SET title_column = $1, complete_column = $2, deadline_column = $3, userid_column = $4 WHERE id = $5', [title, complete, deadline, userid, id], (err) => {
      callback(err);
    });
  }

  function remove(id, callback) {
    db.query('DELETE FROM todos WHERE id = $1', [id], (err) => {
      callback(err);
    })
  }

  /* GET home page. */
  router.get('/', async function (req, res, next) {
    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const wheres = []
    const values = []
    const filterPageArray = []
    var filterPage = ``
    var count = 1;
    // const filterPage = `&name=${req.query.name}&height=${req.query.height}&weight=${req.query.weight}&startDate=${req.query.startDate}&endDate=${req.query.endDate}&married=${req.query.married}&operation=${req.query.operation}`
    const filter = {title: req.query.title,
      complete: req.query.complete,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      operation: req.query.operation
    }

    if (req.query.title) {
        wheres.push(`title ilike '%' || $${count++} || '%'`);
        values.push(req.query.title);
        filterPageArray.push(`&title=${req.query.title}`)
    }

    if (req.query.complete) {
        wheres.push(`complete = $${count++}`);
        values.push(req.query.complete);
        filterPageArray.push(`&complete=${req.query.complete}`)
    }

    if (req.query.startDate || req.query.endDate ) {
        if (req.query.startDate && req.query.endDate) {
            wheres.push(`deadline BETWEEN $${count++} AND $${count++}`)
            values.push(req.query.startDate);
            values.push(req.query.endDate);
            filterPageArray.push(`&startDate=${req.query.startDate}`)
            filterPageArray.push(`&endDate=${req.query.endDate}`)
        }
        else if (req.query.startDate) {
            wheres.push(`deadline >= $${count++}`)
            values.push(req.query.startDate);
            filterPageArray.push(`&startDate=${req.query.startDate}`)
        }
        else if (req.query.endDate) {
            wheres.push(`deadline <= $${count++}`)
            values.push(req.query.endDate);
            filterPageArray.push(`&endDate=${req.query.endDate}`)
        }
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

    // db.query(sql, values, (err, data) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     // console.log(data)
    //     const pages = Math.ceil(data[0].total / limit)
    //     sql = 'SELECT * FROM data'
    //     if (wheres.length > 0) {
    //       if (req.query.operation == 'OR'){
    //         sql += ` WHERE ${wheres.join(' OR ')}`
    //       } else if (req.query.operation == 'AND'){
    //         sql += ` WHERE ${wheres.join(' AND ')}`
    //       }
    //     }
    //     sql += ' LIMIT ? OFFSET ?'
    //     filterPage += filterPageArray.join('')
    //     db.query(sql, [...values, limit, offset], (err, data) => {
    //         if (err) {
    //             console.error(err);
    //         }
    //         console.log(page, pages)
    //         console.log(parseInt(page) === pages)
    //         res.render('todos', { rows: data, pages, page, filter, filterPage })
    //     })
    // })

    db.query(sql, (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log(data.rows);
      res.render('todos', { rows: data.rows, pages, page, filter, filterPage })
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