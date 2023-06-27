const Phone = require('../models/phone');

// define a function to update the image URLs for a given brand
async function updateImageUrls(brand) {
  const phones = await Phone.find({ brand });

  for (const phone of phones) {
    const image = "http://127.0.0.1:4000/images/"+ phone.brand + ".jpeg";
    await Phone.updateOne({ _id: phone._id }, { $set: { image } });
  }
}

// call the function for each brand when the app loads 
async function updateAllBrands() {
  // define the brands to update
  const brands = ['Samsung', 'Apple', 'Nokia','Huawei','HTC','LG','Motorola','Sony']; 
  for (const brand of brands) {
    await updateImageUrls(brand);
  }
}

module.exports = {
    updateAllBrands
}