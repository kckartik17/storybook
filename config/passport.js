const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github').Strategy
const Strategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose')
const keys = require('./keys')

//Load user model
const User = mongoose.model('users')

module.exports = function (passport) {
  //Google Auth
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: image
      }

      //Check for existing user
      User.findOne({
        googleID: profile.id
      })
        .then(user => {
          if (user) {
            //return user
            done(null, user)
          } else {
            //Create user
            new User(newUser)
              .save()
              .then(user => done(null, user));
          }
        })
    })
  )

  //GITHUB 
  passport.use(
    new GithubStrategy({
      clientID: keys.githubClientID,
      clientSecret: keys.githubClientSecret,
      callbackURL: '/auth/github/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));

      const newUser = {
        googleID: profile.id,
        firstName: profile.displayName,
        email: profile.emails[0].value,
        image: image
      }



      //Check for existing user
      User.findOne({
        googleID: profile.id
      })
        .then(user => {
          if (user) {
            //return user
            done(null, user)
          } else {
            //Create user
            new User(newUser)
              .save()
              .then(user => done(null, user));
          }
        })

    }));


    passport.use(new Strategy({
      clientID: keys.facebookClientID,
      clientSecret: keys.facebookClientSecret,
      callbackURL: '/auth/facebook/callback',
      profileFields:['id', 'displayName', 'photos', 'email'],
      enableProof: true
    },
    function(accessToken, refreshToken, profile, cb) {
      // In this example, the user's Facebook profile is supplied as the user
      // record.  In a production-quality application, the Facebook profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      console.log(profile)
      return cb(null, profile);
    }));



  passport.serializeUser((user, done) => {
    done(null, user.id);
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user));
  })
}