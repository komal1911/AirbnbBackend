const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../Models/listing.js");
const express=require("express");
const sampleListings = require("./data.js");
const app=express();


const MONGO_URL="mongodb://localhost:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch(()=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:'65f933821cf155edcb9b46db',
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();