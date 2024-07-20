

const User= require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.Signup=async(req,res)=>{
    try{
      let{username,email,password}=req.body;
      const newUser = new User({email,username});
     const registereduser= await User.register(newUser, password);
     console.log(registereduser);
     req.login(registereduser,(err)=>{
      if(err)
        {
         return next(err);
        }
        req.flash("sucess","welcome to wanderLust !");
        res.redirect("/listings");
     });
    
    } catch(e){
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

  module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
};


module.exports.login=async(req,res)=>{
    req.flash("sucess","Welcome Back to WanderLust ! you are logged in !");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect( redirectUrl);
};


module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
      if(err)
        {
          return next(err);
        }
        req.flash("sucess","You are Logged out !");
        res.redirect("/listings");
    })
  };