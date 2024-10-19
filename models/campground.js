const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual("show").get(function () {
    return this.url.replace("/upload", "/upload/w_900,h_600");
})
imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})

const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    
    // https://mongoosejs.com/docs/geojson.html
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location:String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

},opts)

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<a href="/campgrounds/${this._id}" style="color:grey;">${this.title}</a>`
})

CampgroundSchema.post("findOneAndDelete", async function (campground) {
    console.log("Deleting Campground....")
    if (campground.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
        console.log("Reviews Deleted")
    }
    else {
        console.log("No reviews")
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema)
