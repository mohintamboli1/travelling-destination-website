const express= require("express");
const router = express.Router();
const WrapAsync= require("../utils/WrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../shema.js");
const Listing= require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}= require("../views/middleware.js");
const ListingController= require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });



//Index route
router.get("/",WrapAsync(ListingController.index));


//new route

router.get("/new",isLoggedIn,ListingController.renderNewForm);

//show route
router.get("/:id",WrapAsync(ListingController.showListings ));


//create route

router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing, WrapAsync (ListingController.CreateListing));



//edit route
router.get("/:id/edit",isLoggedIn,isOwner, WrapAsync (ListingController.renderEditForm));

///update route

router.put("/:id",isLoggedIn,isOwner, upload.single("listing[image]"),validateListing, WrapAsync( ListingController.updateListing));

//Delete route

router.delete("/:id",isLoggedIn,isOwner,WrapAsync( ListingController.DeleteListing));


module.exports= router;