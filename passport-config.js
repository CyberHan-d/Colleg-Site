const LocalStrategy = require("passport-local").Strategy
const bcrypt        = require("bcrypt");

function initialize(passport, getUserByLogin) {
  const authenticateUser = async (login, password, done) =>{
    const user = getUserByLogin(login);
    if (user == null) {
      return done(null, false, { message: "Пользователя с таким логином не обнаружено" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Пароль невереный"});
      }
    } catch(err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "login" }), authenticateUser)

  passport.serializeUser((user, done) => { });
  passport.deserializeUser((id, done) => { });
};

module.exports = initialize;
