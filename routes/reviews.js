const express = require("express");
const router = express.Router({mergeParams:true});//All params in appjs or campgroud are together 

const catchAsync = require("../utilities/catchAsync") //error handling
const ExpressError = require("../utilities/ExpressError");

const Campground = require("../models/campground");
const Review = require("../models/review")
const {validateReview, isReviewAuthor} =require("../middleware")
const isloggedIn = require("../middleware")
const reviews = require("../controllers/reviews")


router.post("/", isloggedIn,validateReview,catchAsync(reviews.createreview))

router.delete("/:reviewId", isloggedIn,isReviewAuthor,catchAsync(reviews.deletereview))

module.exports = router;