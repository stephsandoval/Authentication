/* BASES DE DATOS II | INV 01 - AUTHENTICATION | Prof. Kenneth Obando
 * Mariann Marin     | Stephanie Sandoval      |  Mar 07. 2025
 */

const express = require('express');                                                  // import Express framework
const passport = require('passport');                                                // import Passport.js for authentication
const session = require('express-session');                                          // import session for handling user sessions
const path = require('path');                                                        // import path module

require('./auth');                                                                   // load authentication strategy from auth.js
require('dotenv').config();                                                          // environment variables

/* ----------------------------------------------------- */
// Middleware to check if the user is authenticated

const isLoggedIn = (req, res, next) => req.user ? next() : res.redirect('/');

/* ----------------------------------------------------- */
// Create an Express application instance and configure it

const app = express();

// configure express to use EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));                                     // Set the views directory

// configure session management
app.use(session({ 
  secret: process.env.SESSION_SECRET,                                                // env variable for security
  resave: false,                                                                     // don't save session if it hasn't changed
  saveUninitialized: true                                                            // save new sessions
}));

// configure passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());

/* ----------------------------------------------------- */
// Routes

// route: Home (login page)
app.get('/', (req, res) => {
  res.render('login');
});

// route: Initiate Google Authentication
app.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],                                                       // request email and profile info (authorization)
  prompt: 'select_account'                                                           // prompt user to select account every time
}));

// route: Google Authentication Callback
app.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/protected',                                                     // redirect if successful
  failureRedirect: '/auth/failure'                                                   // redirect if failure
}));

// route: Protected Route (only accessible if authenticated)
app.get('/protected', isLoggedIn, (req, res) => {
  res.render('greeting', { user: req.user });                                        // pass user data to template
});

// route: Failure Route (if authentication fails)
app.get('/failure', (req, res) => {
  res.send('Authentication failed.');                                                // display failure message
});

// route: Logout
app.get('/logout', (req, res) => {
  req.logout(err => {                                                                // logout user
    if (err) return next(err);                                                       // handle error
    req.session.destroy(() => {                                                      // destroy session
      res.redirect('/');                                                             // redirect to login page
    });
  });
});

/* ----------------------------------------------------- */
// Start server

app.listen(5000, () => console.log('listening on 5000'));