const bcrypt = require("bcryptjs"),
  localStrategy = require("passport-local").Strategy;

const { getDatabase, ref, onValue } = require("@firebase/database");

require("../database");

module.exports = (passport) => {
  const db = getDatabase();
  const users = ref(db, "users");
  onValue(users, (snapshot) => {
    const users = snapshot.val();

    const findUser = (email) => {
      return users.find((item) => item.email === email);
    };

    const findUserById = (id) => {
      return users.find((item) => item._id === id);
    };

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      try {
        const user = findUserById(id);
        return done(null, user._id);
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    });

    passport.use(
      new localStrategy(
        { usernameField: "email", passwordField: "password" },
        (email, password, done) => {
          try {
            const user = findUser(email);
            if (!user) return done(null, false);

            const isValid = bcrypt.compareSync(password, user.password);

            if (!isValid) return done(null, false);
            return done(null, user);
          } catch (err) {
            console.log(err);
            return done(err, false);
          }
        }
      )
    );
  });
};