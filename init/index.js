const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
};


const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"66920d1a95e6ced876c389c1"}));
    await Listing.insertMany(initData.data);
    console.log("dta was initialized");

};

initDB();