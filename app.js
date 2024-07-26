if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MongoStore=require("connect-mongo");
const MONGO_URL="mongodb://localhost:27017/wanderlust";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const cookieParser=require("cookie-parser");
const ExpressError=require("./utils/ExpressError.js");
var session = require('express-session')


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");

const dbUrl= process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(cookieParser("secretcode"));
main()
.then(()=>{
    console.log("connectec to DB");
})
.catch((err)=>{
    console.log(err);
});

const store=MongoStore.create({
mongoUrl:dbUrl,
crypto:{
secret:process.env.SECRET,
},
touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
async function main(){
    await mongoose.connect(dbUrl);
}

//app.get("/",(req,res)=>{
  //  console.dir(req.cookies);
    //res.send("HI! I am root.");
//});



//app.get("/testListing",async (req,res)=>{
    //let samplelisting=new Listing({
    //title:"My new villa",
    //description:"by the beach",
    //price:1200,
    //location:"Goa",
    //country:"India"
    //});

    //await samplelisting.save();
    //console.log("saplre was saved");
  //  res.send("successful testing");
//});



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    //console.log(res.locals.success); will print an array 
    next();
})

app.use("/listings",listingRouter);

//isme id wala option app.js k andr hi ruk jata h, reviews me ni jata, aage k parameters chle jate h, reviews k andr jane k liye
//hmare pas external option hota h merge params.
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


//create route
/*app.post("/listings",async(req,res,next)=>{
    try{
        const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");}
    catch(err){
        console.log(err);
        next(err);
    }
})*/

//app.get("/demouser",async(req,res)=>{
  //  let fakeUser=new User({
    //    email:"kkomal1911@gmail.com",
      //  username:"student1"
    //});
    //let registeredUser=await User.register(fakeUser,"helloworld");
    //res.send(registeredUser);
//});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!!"));
})
app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
   // res.send("something went wrong");
})
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

