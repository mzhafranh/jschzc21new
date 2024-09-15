module.exports = {
    isLoggedIn: function(req, res, next){
        console.log('user', req.session.user)
        console.log(req.session.id)
        console.log(req.session.user.id)
        if (req.session.user) {
            return next()
        }
        res.redirect('/')
    }
}