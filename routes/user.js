const express= require("express");
const router = express.Router();
const User= require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirecUrl } = require("../views/middleware.js");
const { Signup, renderSignupForm, renderLoginForm, login, logout } = require("../controllers/users.js");



router.get("/signup",renderSignupForm);

router.post("/signup", WrapAsync(Signup  ));


router.get("/login",renderLoginForm);


router.post("/login",saveRedirecUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true} ),login);


router.get("/logout",logout)

module.exports= router;