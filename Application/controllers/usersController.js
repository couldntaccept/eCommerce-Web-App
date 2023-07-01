const User = require("../models/user");
const Phone = require("../models/phone");
const { sendPasswordChangeEmail} = require('../utils/emailService');
const mongoose = require('mongoose');



exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateProfile = async (req, res) => {
  const { firstName, lastName, email, password, userId} = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(422).send('User not found');
    }

    // Verify password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(422).send('Incorrect password');      
    }

    // Update user profile
    user.firstname = firstName;
    user.lastname = lastName;
    user.email = email;
    await user.save();

    return res.status(202).json({ message: 'Profile updated' });

  } catch (err) {
    return res.status(422).send('An error occurred');
  }
}

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, userId} = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(currentPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });      
    }

    user.password = newPassword;
    await user.save();

    sendPasswordChangeEmail(user.email);
    return res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addPhoneListing = async (req, res) => {
  
  const brandList = ['Samsung', 'Apple', 'Nokia', 'Huawei', 'HTC', 'LG', 'Motorola', 'Sony'];

  try {
    const { title, brand, stock, userId, price, disabled} = req.body;

    if (!brandList.includes(brand)) {
      return res.status(400).json({ error: 'Invalid brand' });
    }

    const image = `https://oldphonedeals.onrender.com/images/${brand}.jpeg`;

    const phone = new Phone({
      title,
      brand,
      image,
      stock,
      seller: userId, // Assuming the seller ID is passed in the request body
      price,
      reviews: [],
      disabled,
    });
    await phone.save();
    res.status(201).json(phone);
  } catch (error) {
    console.error('Error adding phone:', error);
    res.status(500).json({ error: 'Failed to add phone' });
  }
};

exports.getPhonesListing = async (req, res) => {
  try {
    const {userId} = req.body;
    const listings = await Phone.find({ seller: userId });
    // if no listings, return empty array
    if (!listings) {
      return res.json([]);
    }
    res.json(listings);
  } catch (error) {
    console.error('Error getting phones:', error);
    res.status(500).json({ error: 'Failed to get phones' });
  }
}


exports.updatePhoneById  = async (req, res) => {
  try {
    const { userId, phoneId, title, brand, stock, price, disabled } = req.body;

    const phone = await Phone.findOneAndUpdate(
      { _id: phoneId, seller: userId },
      title, brand, stock, price, disabled,
      { new: true }
    );

    if (!phone) {
      return res.status(404).json({ error: 'Phone not found or user is not the seller' });
    }

    res.json(phone);
  } catch (error) {
    console.error('Error updating phone:', error);
    res.status(500).json({ error: 'Failed to update phone' });
  }
};

exports.deletePhone = async (req, res) => {
  try {
    const {userId, phoneId} = req.body; 

    const phone = await Phone.findOneAndDelete({ _id: phoneId, seller: userId });

    if (!phone) {
      return res.status(404).json({ error: 'Phone not found or user is not the seller' });
    }

    res.json({ message: 'Phone deleted successfully' });
  } catch (error) {
    console.error('Error deleting phone:', error);
    res.status(500).json({ error: 'Failed to delete phone' });
  }
};


exports.setEnable = async (req, res) => {
  try {
    const {userId, phoneId} = req.body; 

    const phone = await Phone.findOneAndUpdate(
      {_id: phoneId, seller: userId},
      { $unset: { disabled: 1 } }, // Use $unset to remove the disabled field
      { new: true }
    );
    
    if (!phone) {
      return res.status(404).json({ error: 'Phone not found or user is not the seller' });
    }

    res.json(phone);
  } catch (error) {
    console.error('Error disabling phone:', error);
    res.status(500).json({ error: 'Failed to disable phone' });
  }
};

exports.setDisable = async (req, res) => {
  try {
    const {userId, phoneId} = req.body;

    const phone = await Phone.findOneAndUpdate(
      { _id: phoneId, seller: userId },
      { disabled: ""},
      { new: true }
    );

    if (!phone) {
      return res.status(404).json({ error: 'Phone not found or user is not the seller' });
    }
    
    res.json(phone);
  } catch (error) {
    console.error('Error enabling phone:', error);
    res.status(500).json({ error: 'Failed to enable phone' });
  }
};
