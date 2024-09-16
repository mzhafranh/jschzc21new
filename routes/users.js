var express = require('express');
var router = express.Router();
var path = require('path');
const helpers = require('../helpers/util')

module.exports = function (db) {

  function getAvatar(userid, callback){
    db.query(`SELECT avatar FROM users WHERE id = ${userid}`, [], (err, data) => {
      callback(err, data);
    })
  }

  router.get('/avatar', helpers.isLoggedIn, function (req, res, next) {
    console.log(req.session.user.avatar)

    getAvatar(req.session.user.id, (err, avatarData) => {
      if (err) {
        console.error(err)
      }
      res.render('avatar', { avatar: avatarData.rows[0].avatar})
    })
  });

  router.post('/avatar', helpers.isLoggedIn, function (req, res, next) {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
    }
    var avatar = req.files.avatar
    var [username] = req.session.user.email.split('@')
    var avatarFilename = username + Date.now() + path.extname(avatar.name)
    var filePath = path.join(__dirname, '..', 'public', 'images', 'uploads', avatarFilename)

    avatar.mv(filePath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      
      db.query('UPDATE users SET avatar = $1 WHERE id = $2', [avatarFilename, req.session.user.id], (err, data) => {
        if (err) {
          console.error(err);
        }
        res.redirect('/todos');
      });
    })

  });

  return router
}
