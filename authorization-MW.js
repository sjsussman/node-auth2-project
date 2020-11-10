function secure(req, res, next) {
    //check if there is a user in the session
    if(req.session && req.session.user) {
      next()
    } else {
      res.status(401).json({
        message: 'Unauthorized'
      })
    }
  }

  module.exports = secure;