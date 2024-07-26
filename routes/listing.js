const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}= require("../schema.js");
const Review=require("../Models/review.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../Models/listing.js");
const {isOwner,validateListing,isLoggedIn}=require("../middleware.js");
const multer=require('multer');
//const upload = multer({ dest: 'uploads/' })
const listingController=require("../controllers/listings.js");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//index route
router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show route
router.get("/:id",wrapAsync(listingController.showListing));

//create route
router.post("/",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
//router.post('/', upload.single('listing[image]'), function (req, res, next){
  //  res.send(req.file);
//} )

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderFormEdit))

//update route

router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;



