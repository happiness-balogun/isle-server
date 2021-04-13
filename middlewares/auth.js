const User = require("./../models/user");

let auth = (req, res, next) => {
  let auth = req.headers["authorization"];
  token = auth.replace("Bearer ", "");
  token = token.trim();
  console.log(token);
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        error: true,
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
