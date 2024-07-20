if(process.env.NODE_ENV != "production")
{
    require("dotenv").config();
}



const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const WrapAsync= require("./utils/WrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");

const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
 
const DBURL= process.env.DBURL;



main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(DBURL);
};


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

const store= MongoStore.create({
    mongoUrl:DBURL,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  });

store.on("err",()=>{
console.log("error in mongo session store", err);
});



const sessionoption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    
};

app.get("/listings/filters",(req,res)=>{
   res.send("working");
});



app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.sucess= req.flash("sucess");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
});

app.get("/demouser",async(req,res)=>{
      let fakeuser= new User({
        email:"student@gmail.com",
        username:"deltastudent"
      });
     let registereduser = await User.register(fakeuser,"helloworld");
     res.send(registereduser);
});



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", userRouter);

app.get("/testListing",WrapAsync( async(req,res)=>{
      let sampleListing= new Listing({
         title:"my New Villa",
         description:"By the Beach",
         price: 1200,
         location:"calungute,goa",
         country:"India",
      });
      await sampleListing.save();
      console.log("sample was saved");
      res.send("sucessful testing");

}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let{statuscode=500,message="something went wrong"}=err;
    res.status(statuscode).render("error.ejs",{message});
   // res.status(statuscode).send(message);
});


app.listen(3000,()=>{
    
    console.log("listening on port 3000");
});
