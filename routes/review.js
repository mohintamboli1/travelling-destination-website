const express= require("express");
const router = express.Router({mergeParams:true});
const WrapAsync= require("../utils/WrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../shema.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {validatereview, isLoggedIn, isReviewAuthor}= require("../views/middleware.js");
const { CreateReview, DeleteReview } = require("../controllers/reviews.js");










//reviews

router.post("/",isLoggedIn, validatereview,WrapAsync(CreateReview));
 
 
 //delete review route
 
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor, WrapAsync( DeleteReview ));
 

 module.exports= router;