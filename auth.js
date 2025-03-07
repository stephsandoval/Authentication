/* BASES DE DATOS II | INV 01 - AUTHENTICATION | Prof. Kenneth Obando
 * Mariann Marin     | Stephanie Sandoval      |  Mar 07. 2025
 */

const passport = require('passport');                                                // import Passport.js for authentication
const GoogleStrategy = require('passport-google-oauth2').Strategy;                   // import Google OAuth2 strategy

require('dotenv').config();                                                          // environment variables

/* ----------------------------------------------------- */
// Configure Passport.js with Google OAuth2 strategy

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,                                          // google client id from .env
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,                                  // google client secret from .env
    callbackURL: process.env.GOOGLE_CALLBACK_URL,                                    // google callback url from .env
    passReqToCallback: true                                                          // pass the request to the callback function
  },
  // callback function that runs after authentication
  // profile contains user info from Google
  (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile);                                                      // proceed with authentication, send user profile
  }
));

// serialize user info into the session
passport.serializeUser((user, done) => {
  done(null, user);                                                                  // store the user in the session
});

// deserialize user info from the session
passport.deserializeUser((user, done) => {
  done(null, user);                                                                  // retrieve the user from the session
});
