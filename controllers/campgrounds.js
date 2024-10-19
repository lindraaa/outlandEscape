const Campground = require("../models/campground");
//Maps
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require("../cloudinary")

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}

module.exports.rendernewform = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createcampground = async (req, res, next) => {
    // converts a location (like an address) into geographic coordinates 
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    
    // if(!req.body.Campground) throw new ExpressError("Invalid Campground", 400);
    const newCampground = new Campground({ ...req.body.campground });
    newCampground.geometry = geodata.body.features[0].geometry
    //change the models for uploading images in cloudinary
    newCampground.images = req.files.map(fl => ({ url: fl.path, filename: fl.filename }))
    newCampground.author = req.user._id; // creating new campground with specific user
    await newCampground.save();
    console.log(newCampground)
    req.flash("success", "Successfully Added New Campground")
    res.redirect(`/campgrounds/${newCampground._id}`)

}

module.exports.showcampgrounds = async (req, res) => {
    const { id } = req.params;
    const showcampground = await Campground.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }
    ).populate("author");
    // console.log(showcampground);
    if (!showcampground) {
        req.flash('error', "Cannot find that campground")
        return res.redirect("/campgrounds")
    }
    console.log(showcampground)
    res.render("campgrounds/show", { showcampground })
}

module.exports.rendereditform = async (req, res) => {
    const { id } = req.params;
    const showcampground = await Campground.findById(id);
    if (!showcampground) {
        req.flash('error', "Cannot find that campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { showcampground })
}
module.exports.updatecampgrounds = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body)
    const updateCampgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true })
    const imgs = req.files.map(fl => ({ url: fl.path, filename: fl.filename }));
    updateCampgrounds.images.push(...imgs);
    // deleting image in mongodb and cloudinary
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await updateCampgrounds.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        // console.log(updateCampgrounds)
    }
    await updateCampgrounds.save();
    // console.log("Updated Successfully ")
    req.flash("success", "Successfully Updated Campground")
    res.redirect(`/campgrounds/${updateCampgrounds.id}`)
}

module.exports.deletecampgrounds = async (req, res) => {
    const { id } = req.params;
    const deleteCampgrounds = await Campground.findByIdAndDelete(id);
    // console.log("Deleted Successfully")
    req.flash("success", "  Successfully Deleted Campground")
    res.redirect("/campgrounds");
}