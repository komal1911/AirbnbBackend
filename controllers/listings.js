const Listing=require("../Models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}


module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id).populate({
        path:"reviews",
        populate:{
         path:"author",
        },}).populate("owner");
    if(!listing){
        req.flash("error","listing you requested for doesn't exist");
        res.redirect("/listings");
    }
    else{
    //console.log(listing);
    res.render("listings/show.ejs",{listing});
    }
}

module.exports.renderNewForm=(req,res)=>{
 res.render("listings/new.ejs");
}
module.exports.createListing=async(req,res,next)=>{
    /*if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    const newListing= new Listing(req.body.listing);
    if(!newListing.title){
        throw new ExpressError(400,"Title is missing");
    }
    if(!newListing.description){
        throw new ExpressError(400,"Description is missing");
    }
    if(!newListing.location){
        throw new ExpressError(400,"Location is missing");
    }*/
    //let result=listingSchema.validate(req.body);
    //console.log(result);
    let response=await geocodingClient
    .forwardGeocode({
       //query:"New Delhi, India",
       query:req.body.listing.location,
        limit:1
    })
    .send();
    
    let url=req.file.path;
    let filename=req.file.filename;
    //console.log(url,"..",filename);
    
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","new listing created");


    res.redirect("/listings");   
}


module.exports.renderFormEdit=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
     req.flash("error","listing you requested for doesn't exist")
     res.redirect("/listings");
    }
    else{
        let originalImageUrl=listing.image.url;
        originalImageUrl.replace("/upload","/upload/w_250");
 res.render("listings/edit.ejs",{listing, originalImageUrl});
    }
}


module.exports.updateListing=async(req,res)=>{
    //if(!req.body.listing){
     //   throw new ExpressError(400,"send valid data for listing");
   // }
    let {id}=req.params;
    //let {id} = req.params;
    //let listing=await Listing.findById(id);
    //if(!listing.owner.equals(res.locals.currUser._id)){
        //req.flash("error","you are not the owner of the listing");
      //  return res.redirect(`/listings/${id}`);
    //}
    
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof(req.file) !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","listing is updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","listing is deleted");
    res.redirect("/listings");
}