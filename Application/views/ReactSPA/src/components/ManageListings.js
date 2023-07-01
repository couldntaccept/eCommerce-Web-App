import React, { useState, useEffect, useContext } from 'react';
import LoginContext from '../store/LoginContext';
import {Button, Table,TableHead,TableBody,TableRow,TableCell,Switch, Dialog, DialogTitle, DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,} from '@mui/material';


const brandList = ['Samsung', 'Apple', 'Nokia', 'Huawei', 'HTC', 'LG', 'Motorola', 'Sony'];


export const ManageListings = () => {

  const [listings, setListings] = useState([]);
  const [change, setChange] = useState(false);
  const [open, setOpen] = useState(false);
  const [isStockValid, setIsStockValid] = useState(null);
  const [isPriceValid, setIsPriceValid] = useState(null);
  const [isTitleValid, setIsTitleValid] = useState(null);
  const [isBrandValid, setIsBrandValid] = useState(null);

  const [newListing, setNewListing] = useState({
    title: '',
    brand: '',
    price: 0,
    stock: 0,
  });
  
  const loginctx = useContext(LoginContext);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    

    // Validate stock field should be numeric
    if (name === 'stock') {
      // setIsStockValid(false);
      const floatValue = parseFloat(value);
      const isValid = Number.isInteger(floatValue) && floatValue >= 0 && Number.isSafeInteger(floatValue);
      setIsStockValid(isValid);
    }
    

    // Validate price field should be numeric
    if (name === 'price') {
      // setIsPriceValid(false);
      const isValid = /^\d+(\.\d{1,2})?$/.test(value); // Regular expression to check for numeric value
      setIsPriceValid(isValid);
    }

    // Validate title field should be non-empty
    if (name === 'title') {
      // setIsTitleValid(false);
      const isValid = value.trim() !== '';
      setIsTitleValid(isValid);
    }

    // Validate brand field should be non-empty
    if (name === 'brand') {
      const isValid = value.trim() !== '';
      setIsBrandValid(isValid);
    }
      

    setNewListing({
      ...newListing,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddListing = async () => {
    try {
      // if all valid send request to add listing
      if (isStockValid && isPriceValid && isTitleValid && isBrandValid) {
        const response = await fetch('https://oldphonedeals.onrender.com/users/listing/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: loginctx.LoginUserId,
            title: newListing.title,
            brand: newListing.brand,
            stock: newListing.stock,
            price: newListing.price,
          }),
        });
        const data = await response.json();
        alert("Listing added successfully");
        setChange(!change);
         // Reset the new listing form and close the dialog
        setNewListing({
          title: '',
          brand: '',
          stock: '',
          price: '',
        });
        setOpen(false);
      }else{
        //show error message
        console.log("Invalid input");
        alert("Invalid input, please make input valid");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [change]);

  const fetchListings = async () => {
    try {
        const response = await fetch("https://oldphonedeals.onrender.com/users/listing",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: loginctx.LoginUserId,
            }),
        });
        const data = await response.json();
        
        setListings(data);
    } catch (err) {
        console.error(err); 
    }
  };

  const addListing = () => {
    handleOpen();
  };

  const enableDisableListing = async (listingId) => {
    try {
      const response = await fetch("https://oldphonedeals.onrender.com/users/listing/enable", 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              userId: loginctx.LoginUserId,
              phoneId: listingId
          }),
      });
      const data = await response.json();
      
      setChange(!change);
    } catch (err) {
        console.error(err); 
    }
  };

  const disableListing = async (listingId) => {
    try {
      const response = await fetch("https://oldphonedeals.onrender.com/users/listing/disable", 
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              userId: loginctx.LoginUserId,
              phoneId: listingId
          }),
      });
      const data = await response.json();
      
      setChange(!change);
    } catch (err) {
        console.error(err); 
    }
  };

  const handleToggleListing = (listingId) => {
    
    const listing = listings.find((listing) => listing._id === listingId);
    
    if (listing) {
      if (listing.disabled==="") {
        enableDisableListing(listingId);
      } else {
        disableListing(listingId);
      }
      setChange(!change);
    }
  };

  const removeListing = async (listingId) => {
    // confirm before deleting
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        const response = await fetch("https://oldphonedeals.onrender.com/users/listing/delete", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: loginctx.LoginUserId,
                phoneId: listingId
            }),
        });
        const data = await response.json();
        setChange(!change);
        alert("Listing deleted");
      } catch (err) {
          console.error(err); 
      }
    }

  };

  return (
    <div>
      <h2>Manage Listings</h2>
      <Button onClick={addListing}>Add New Listing</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Listing</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            value={newListing.title}
            onChange={handleChange}
            fullWidth
            error={!isTitleValid}
            helperText={!isTitleValid ? 'Please enter a valid title' : ''}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            name="price"
            value={newListing.price}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
            error={!isPriceValid}
            helperText={!isPriceValid ? 'Please enter a valid number' : ''}
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            name="stock"
            value={newListing.stock}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, step:1 }}
            error={!isStockValid}
            helperText={!isStockValid ? 'Please enter a valid number' : ''}
          />
          <FormControl fullWidth>
            <InputLabel id="brand-label">Brand</InputLabel>
            <Select
              labelId="brand-label"
              id="brand"
              name="brand"
              value={newListing.brand}
              onChange={handleChange}
            >
              {brandList.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddListing} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Img</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Disabled</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>No listings available</TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow
                key={listing._id}
                sx={{
                  backgroundColor: listing.disabled !== undefined ? '#ccc' : 'inherit'
                }}
              >
                <TableCell>
                  <img src={listing.image} alt="Phone" style={{ width: 50, height: 50 }} />
                </TableCell>
                <TableCell>{listing.title}</TableCell>
                <TableCell>${listing.price.toFixed(2)}</TableCell>
                <TableCell>{listing.stock}</TableCell>
                <TableCell>
                <Switch
                  checked={listing.disabled !== undefined ? true : false}
                  onChange={() => handleToggleListing(listing._id)}
                />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => removeListing(listing._id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ManageListings;
