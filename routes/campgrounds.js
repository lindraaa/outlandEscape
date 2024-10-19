const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync") //error handling
const campgrounds = require("../controllers/campgrounds");
const {storeReturnTo,validateCampground,isAuthor} = require("../middleware")
const isloggedIn = require("../middleware")

const{storage} = require("../cloudinary")
//upload image using muttler
// https://github.com/expressjs/multer
const multer  = require('multer');
const upload = multer({storage});


router.get("/", catchAsync(campgrounds.index))

router.get("/new", isloggedIn,campgrounds.rendernewform)

router.post("/", isloggedIn, upload.array("image"), validateCampground,catchAsync(campgrounds.createcampground))

// router.post("/",upload.array("image"),(req,res,next)=>{
//     console.log(req.body,req.files)
//     res.send("It worked")
// })

router.get("/:id", catchAsync(campgrounds.showcampgrounds))

router.get("/:id/edit",isloggedIn, isAuthor,catchAsync(campgrounds.rendereditform))

router.put("/:id", isloggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updatecampgrounds))

router.delete("/:id", isloggedIn,isAuthor,catchAsync(campgrounds.deletecampgrounds))


/* Restructuring code
router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isloggedIn, validateCampground, catchAsync(campgrounds.createcampground))


router.get("/new", isloggedIn, campgrounds.rendernewform)

router.route("/:id")
    .get(catchAsync(campgrounds.showcampgrounds))
    .put(isloggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updatecampgrounds))
    .delete(isloggedIn, isAuthor, catchAsync(campgrounds.deletecampgrounds))

router.get("/:id/edit", isloggedIn, isAuthor, catchAsync(campgrounds.rendereditform))



*/
module.exports = router;