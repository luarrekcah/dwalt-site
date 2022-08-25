 const authenticationMiddleware = (req, res, next) => {
    if (!req.isAuthenticated())  
        return res.redirect("/usuario/login");
  };

module.exports = { authenticationMiddleware };