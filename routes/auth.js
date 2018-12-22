const express = require('express')
const router = express.Router();
const passport = require('passport')

router.get('/google',passport.authenticate('google',{
  scope:['profile','email']
}));


router.get('/google/callback',
passport.authenticate('google',{
  failureRedirect:'/'
}),
(req,res) => {
  res.redirect('/dashboard')
})

//Github

router.get('/github',passport.authenticate('github'));
router.get('/github/callback',
passport.authenticate('github',{
  failureRedirect:'/'
}),
(req,res) => {
  res.redirect('/dashboard')
})

//Twitter

router.get('/twitter',passport.authenticate('twitter'));
router.get('/twitter/callback',
passport.authenticate('twitter',{
  failureRedirect:'/'
}),
(req,res) => {
  res.redirect('/dashboard')
})


router.get('/verify',(req,res) => {
  if(req.user){
    console.log(req.user);
  }else{
    console.log('Not Auth')
  }
});

router.get('/logout',(req,res) => {
  req.logOut();
  res.redirect('/');
})

module.exports = router;