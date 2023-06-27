const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const phoneSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    seller: {
        type: "String",
        //ref: "User",
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    reviews: {
        type: [
            {
                reviewer: {
                    type: String,
                    //ref:"User",
                    required: true
                },
                rating: {
                    type: Number,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                },
                hidden: {
                    type: String,
                    required: false
                }
            }
        ],
        required: false
    },
    disabled: {
        type: String,
        required: false
    },
    averageRating: {
        type:  Number,
        required: false
    }

})
//connects a schema with the name 'phone'
phoneSchema.index({ seller: 1 });
phoneSchema.index({ 'reviews.reviewer': 1 });
module.exports = mongoose.model('Phone', phoneSchema)