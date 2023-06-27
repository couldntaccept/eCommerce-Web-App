const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        phone: {
            type: Schema.Types.ObjectId,
            ref: 'Phone',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        stock:{
            type: Number,
            required: true,
        },
        title:{
            type: String,
            required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
