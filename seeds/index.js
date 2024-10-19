const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");


//mongoose 
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("Database Connected")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    });


const randomarray = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let x = 0; x < 50; x++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price_random = Math.floor(Math.random() *20) + 10;
        const camp = new Campground({
            author:"67071087727c9f2e4b18a35c",
            title: `${randomarray(descriptors)} ${randomarray(places)}`,
            location: `${cities[random1000].city},  ${cities[random1000].state}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione exercitationem delectus adipisci accusantium ipsum id. Soluta blanditiis repellendus deserunt sit provident consequatur nisi voluptatum velit voluptas nesciunt? Ratione, possimus ipsam.",
            price: price_random,
            images:[
                {
                    url: 'https://res.cloudinary.com/dcfbluuv1/image/upload/v1728787232/Yelpcamp/kabjhrx60ws15kz34qhr.jpg', 
                    filename: 'Yelpcamp/kabjhrx60ws15kz34qhr',
                  },
                  {
                    url: 'https://res.cloudinary.com/dcfbluuv1/image/upload/v1728787235/Yelpcamp/uxuyknzccizfslyi1nhc.jpg', 
                    filename: 'Yelpcamp/uxuyknzccizfslyi1nhc',
                  }
            ]
        })
        await camp.save();
    }

}
seedDB().then(()=>{
    mongoose.disconnect()
    console.log("Database Disconnected")
})