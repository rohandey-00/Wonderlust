
const Joi = require('joi');




//we need to validate the listing schema...

module.exports.listingSchema = Joi.object({
    Listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().positive().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),

    }).required(),  // full listing must be available
});



/*    CHAT GPTTTTT         Schema for Creating a New Listing:

javascript
Copy code
const Joi = require('joi');

module.exports.createListingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().uri().required(),
        filename: Joi.string().required()
    }).required(),
    price: Joi.number().positive().required(),
    location: Joi.string().required(),
    country: Joi.string().required()
});
Schema for Updating an Existing Listing:

javascript
Copy code
const Joi = require('joi');

module.exports.updateListingSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    image: Joi.object({
        url: Joi.string().uri(),
        filename: Joi.string()
    }),
    price: Joi.number().positive(),
    location: Joi.string(),
    country: Joi.string()
}).or('title', 'description', 'image', 'price', 'location', 'country');  // Ensure at least one field is provided */




//validate review Schema

module.exports.reviewSchema = Joi.object({
    Review: Joi.object({                    // here r is in small letter because we send by form "review[listing]" something
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
        createdAt: Joi.date().allow(null),

    }).required(),
});

