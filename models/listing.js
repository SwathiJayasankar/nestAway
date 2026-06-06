const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { listingCategories } = require("../utils/categories.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://www.travelandleisure.com/thmb/_9nXniA6GZsRPV4UwaNrXhbKs00=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sandals-royal-caribbean-villas-ALLINC0522-3429e86c9d2841b38c7ef9757220ed1c.jpg",
        set: (v) => {
            if (!v || v.trim() === "") {
                return "https://www.travelandleisure.com/thmb/_9nXniA6GZsRPV4UwaNrXhbKs00=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sandals-royal-caribbean-villas-ALLINC0522-3429e86c9d2841b38c7ef9757220ed1c.jpg";
            }
            return v.trim();
        },
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: listingCategories,
        default: "rooms",
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
        },
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

//deletes all review of the deleted listing
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;