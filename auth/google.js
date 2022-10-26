const passport = require("passport"),
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
  { getDatabase, ref, set, onValue } = require("@firebase/database");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientId,
      clientSecret: process.env.googleClientSecret,
      callbackURL: "https://www.dlwalt.com/usuario/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const db = getDatabase();
      const users = ref(db, "users");
      onValue(users, (snapshot) => {
        let allUsers = snapshot.val();
        if (allUsers == null) {
          allUsers = [];
        }

        const findUser = (email) => {
          return allUsers.find((item) => item.email === email);
        };
    
        const findUserById = (id) => {
          return allUsers.find((item) => item._id === id);
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
        
        const user = {
          _id: profile.id,
          email: profile.emails[0].value,
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

        if (findUser(user.email)) {
          try {
            return done(null, user);
          } catch (err) {
            console.log(err);
            return done(err, false);
          }
        } else {
          allUsers.push(user);

          set(ref(db, "users"), allUsers).then(() => {
            console.log("Registro atualizado");
            try {
              return done(null, user);
            } catch (err) {
              console.log(err);
              return done(err, false);
            }
          });
        }
      }/*,  {
        onlyOnce: true
      }*/);
    }
  )
);

module.exports = passport;
