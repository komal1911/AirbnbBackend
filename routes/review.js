const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../Models/listing.js");
const Review=require("../Models/review.js");
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");
//const { createReview } = require("../controllers/reviews.js");
const reviewController=require("../controllers/reviews.js");

//validateReview ko as a middleware pass krdia and wrapAsync ko error handling k liye use krliya.
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))
    
module.exports=router;