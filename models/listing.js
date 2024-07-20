const { urlencoded } = require("express");
const { ref } = require("joi");
const mongoose= require("mongoose");
const { findOneAndDelete } = require("./review");
const Schema= mongoose.Schema;
const Review= require("./review.js");

const listingSchema= mongoose.Schema({
         title:{
            type:String,
            required:true,
         },
         description:{
            type:String
         },
         image:{
            
           url: String,
           filename: String
         },
         price:{
            type:Number
         },
         location:{
            type:String
         },
         country:{
            type:String
         },
         reviews:[
            {
               type: Schema.Types.ObjectId,
               ref:"Review",
            }
         ],
         owner:{
            type: Schema.Types.ObjectId,
            ref:"User"
         },

         category:{
            type:String,
            enum: ["Mountains","Castles","Amazing Pools","Farms"]
         }

        });

        listingSchema.post("findOneAndDelete", async(listing)=>{
             if(listing)
               {
                  await Review.deleteMany({_id:{$in: listing.reviews}});
               }
        });

        const Listing= mongoose.model("Listing",listingSchema);
        module.exports= Listing;