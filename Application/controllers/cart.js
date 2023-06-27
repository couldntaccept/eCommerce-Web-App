const Cart = require("../models/cart");
const mongoose = require('mongoose');
const Phone = require("../models/phone");



exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.body;
        // get all items in the cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            // Create a new cart if it doesn't exist
            const newCart = new Cart({
                user: userId,
                items: [],
            });
            await newCart.save();
            const cart = await Cart.findOne({ user: userId });
            return res.json(cart.items);
        }
        res.json(cart.items);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.addToCart = async (req, res) => {
    try {
        const { userId, phoneId, quantity, price, image, stock, title } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            const newCart = new Cart({
                user: userId,
                items: [{ phone: phoneId, quantity: quantity, price: price, image: image, stock: stock, title: title}],
            });
            
            await newCart.save();
            const cart = await Cart.findOne({ user: userId });
            return res.json(newCart);
        }

        // Check if the phone already exists in the cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.phone.toString() === phoneId
        );

        if (existingItemIndex === -1) {
            // Add a new item to the cart if the phone isn't in the cart yet
            cart.items.push({ phone: phoneId, quantity: quantity, price: price, image: image, stock: stock, title: title });
        } else {
            // Update the quantity of the existing item
            cart.items[existingItemIndex].quantity += quantity;
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getQuantity = async (req, res) => {
    try {
        const { userId, phoneId } = req.body;
        const cart = await Cart.findOne({ user: userId });
        // if not exist
        if (!cart) {
            res.json(0);
            return;
        }
        // if phone not exist in items
        const itemIndex = cart.items.findIndex((item) => item.phone.toString() === phoneId);
        if (itemIndex === -1) {
            res.json(0);
            return;
        }
        // if phone exist in items
        const quantity = cart.items[itemIndex].quantity;
        res.json(quantity);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};



exports.removeItems = async (req, res) => {
    try {
        const { userId, phoneId } = req.body;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex((item) => item.phone.toString() === phoneId);

        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);

        await cart.save();

        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


exports.updateQuantity = async (req, res) => {
    try {

        const { userId, phoneId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        const item = cart.items.find((item) => item.phone.toString() === phoneId);

        if (!item) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        item.quantity = quantity;
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.clear = async (req, res) => {
    try {
        const { userId } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        cart.items = [];

        await cart.save();

        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.checkout = async (req, res) => {
    try {
      const { userId } = req.body;
  
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ msg: 'Cart not found' });
      }
  
      const { items } = cart;
  
      // Get the unique phone IDs in the cart
      const phoneIds = [...new Set(items.map((item) => item.phone.toString()))];
  
      // Fetch the phones from the database
      const phones = await Phone.find({ _id: { $in: phoneIds } });
  
      // Update the stock quantity for each phone in the cart
      items.forEach((item) => {
        const phone = phones.find((p) => p._id.toString() === item.phone.toString());
        if (phone) {
          const updatedStock = phone.stock - item.quantity;
          if (updatedStock < 0) {
            throw new Error(`Insufficient stock for phone ${phone._id}`);
          }
          phone.stock = updatedStock;
          item.stock = updatedStock;
          phone.save();
        }
      });

      // Clear the cart after successful checkout
      cart.items = [];
      await cart.save();
  
      res.json({ msg: 'Checkout successful' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  

