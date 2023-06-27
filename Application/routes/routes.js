const phonesController = require('../controllers/phoneController.js');
const usersController = require('../controllers/usersController.js');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cart.js');

const express = require ('express');
const path = require('path');
const router = express.Router();

router.get('/phones/view',phonesController.getPhone);
router.get('/phones/search',phonesController.searchPhones);
router.get('/phones/soldout',phonesController.soldoutPhones);
router.get('/phones/best',phonesController.bestsellerPhones);
router.post('/phones/name',phonesController.getPhonesByTitle);
router.get('/users',usersController.getUserById );
router.post('/phones/review',phonesController.postReview);
router.get('/phones/:userId/comments', phonesController.viewComments);
router.put('/phones/:phoneId/comments/:commentIndex', phonesController.toggleHidden);

router.post('/cart/user',cartController.getCartByUserId);
router.post('/cart/add',cartController.addToCart);
router.post('/cart/remove',cartController.removeItems);
router.post('/cart/update',cartController.updateQuantity);
router.post('/cart/quantity',cartController.getQuantity);
router.post('/cart/clear',cartController.clear);
router.post('/cart/checkout',cartController.checkout);

router.post('/phones/review/sethidden',phonesController.setHidden)



router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/verify-email', authController.verifyEmail);
router.post('/auth/request-reset-password', authController.requestResetPassword);
router.post('/auth/reset-password', authController.resetPassword);

router.get('/users/:userId', usersController.getUserById);
router.post('/users/updateProfile', usersController.updateProfile);
router.post('/users/changePassword', usersController.changePassword);

router.post('/users/listing', usersController.getPhonesListing);
router.post('/users/listing/add', usersController.addPhoneListing);
// router.post('/users/listing/update', usersController.updatePhoneById);
router.post('/users/listing/delete', usersController.deletePhone);
router.post('/users/listing/disable', usersController.setDisable);
router.post('/users/listing/enable', usersController.setEnable);




//Serve the compiled React application when the user visits any path https://handsonreact.com/docs/build-deploy
router.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, "..",'views/ReactSPA/build', 'index.html'));
  });


module.exports = router;

