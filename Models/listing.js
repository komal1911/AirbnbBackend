const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
        
    },
    description:String,
    price:Number,
    //image:{
      //  default:"https://plus.unsplash.com/premium_photo-1671581559748-7538cc86cbe4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwbHVzLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D",
        //type:String,
        //set:(v)=>v===""?"https://plus.unsplash.com/premium_photo-1671581559748-7538cc86cbe4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwbHVzLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D" : v,
    //},
    image:{
        url:String,
        filename:String

    },
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    },],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

const Listing=mongoose.model("Listing",listingSchema);

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})
module.exports=Listing;