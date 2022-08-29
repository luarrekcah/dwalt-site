const passport = require("passport"),
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
  { getDatabase, ref, set, onValue } = require("@firebase/database");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientId,
      clientSecret: process.env.googleClientSecret,
      callbackURL: process.env.url + "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const db = getDatabase();
      const users = ref(db, "usersWebsite");
      onValue(users, (snapshot) => {
        let allUsers = snapshot.val();
        if (allUsers == null) {
          allUsers = [];
        }
        const findUserById = (id) => {
          return allUsers.find((item) => item.userid === id);
        };

        passport.serializeUser((user, done) => {
          done(null, user.userid);
        });

        passport.deserializeUser((id, done) => {
          try {
            const user = findUserById(id);
            done(null, user);
          } catch (err) {
            console.log(err);
            return done(err, null);
          }
        });

        const user = {
          _id: profile.id,
          email: data.email,
          password: '',
          verified: false,
          documents: {
            name: profile.displayName,
            cpfOrCnpj: "",
          },
          contact: {
            number: ""
          },
          contractURL: ""
        };

        if (findUserById(user.userid)) {
          try {
            return done(null, user);
          } catch (err) {
            console.log(err);
            return done(err, false);
          }
        } else {
          allUsers.push(user);

          set(ref(db, "usersWebsite"), allUsers).then(() => {
            console.log("Registro atualizado");
            try {
              return done(null, user);
            } catch (err) {
              console.log(err);
              return done(err, false);
            }
          });
        }
      });
    }
  )
);

module.exports = passport;
