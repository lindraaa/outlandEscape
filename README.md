# Outland Escape

Outland Escape is a web application designed to help users discover and share information about campgrounds. Users can browse, review, and add campgrounds, making it a community-driven platform for outdoor enthusiasts.

## Features

- **Campground Listings**: Browse a variety of campgrounds with detailed descriptions and images.
- **User Authentication**: Secure user registration and login system.
- **Reviews and Ratings**: Add reviews and ratings to campgrounds.
- **Interactive Maps**: View campground locations on an interactive map.
- **Image Uploads**: Upload images for campgrounds using Cloudinary.
- **Error Handling**: Comprehensive error handling for a smooth user experience.

## Project Structure

The project is organized as follows:

```
app.js                # Main application file
middleware.js         # Custom middleware functions
package.json          # Project dependencies and scripts
schemas.js            # Validation schemas

cloudinary/           # Cloudinary configuration
controllers/          # Route controllers
models/               # Mongoose models
public/               # Static assets (JS, CSS, images)
routes/               # Application routes
seeds/                # Seed data for the database
uploads/              # Uploaded files
tilities/             # Utility functions
views/                # EJS templates
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS, Bootstrap
- **Cloud Services**: Cloudinary (image uploads), Mapbox (interactive maps)

