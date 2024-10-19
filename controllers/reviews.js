const Campground = require("../models/campground");
const Review = require("../models/review")


module.exports.createreview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    
    //saving author in a review
    review.author = req.user._id;

    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success","Created New Review")
    // console.log(campground);
    res.redirect(`/campgrounds/${campground.id}`)
}
module.exports.deletereview =  async(req,res)=>{
    const{id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Successfully Delete Review")
    res.redirect(`/campgrounds/${id}`)
}