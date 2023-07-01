import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Grid, Card, CardContent, CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect } from 'react';
import LoginContext from '../store/LoginContext';


const CheckoutPage = ({  }) => {
  const [items, setItems] = useState([]);
  
  const navigate = useNavigate();
  const loginctx = useContext(LoginContext);

  const handleBack = () => {

      navigate(-1);
  };

  const getCartItems = async () => {
      try {
          const response = await fetch(`http://oldphonedeals.onrender.com/cart/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // need to be updated to the userid in context
                userId: loginctx.LoginUserId,
            }),
          });
          const data = await response.json();
    
          // Make sure cartItems is always an array
          
          if (data.msg !== 'Cart not found') {
            setItems(data);
          }
  
          // setItems(data);
      } catch (error) {
          console.error('Error fetching cart items:', error);
      }
  };

  const removeCartItem = async (cartItemId) => {
    try {
        const response = await fetch(`http://oldphonedeals.onrender.com/cart/remove`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              // need to be updated to the userid in context
              userId: loginctx.LoginUserId,
              phoneId: cartItemId,
          }),
        });
        const data = await response.json();
      } catch (error) {
          console.error('Error remove cart items:', error);
      }
  };

  const clearCart = async () => {
    try {
        const response = await fetch(`http://oldphonedeals.onrender.com/cart/clear`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              // need to be updated to the userid in context
              userId: loginctx.LoginUserId,
          }),
        });
        const data = await response.json();
      } catch (error) {
          console.error('Error clear cart items:', error);
      }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
        const response = await fetch("http://oldphonedeals.onrender.com/cart/update ", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              // need to be updated to the userid in context
              userId: loginctx.LoginUserId,
              phoneId: cartItemId,
              quantity: quantity,
          }),
        });
        const data = await response.json();
      } catch (error) {
          console.error('Error update cart items:', error);
      }
  };

  const handleQuantityChange = (index, quantity) => {
    if (quantity <= 0) {
      // Remove item if quantity is zero or negative
      
      removeCartItem(items[index].phone);
      setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    }
    else {
      // Update item quantity
      updateCartItem(items[index].phone, quantity);
      setItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index ? { ...item, quantity } : item
        )
      );
    }
  };


                  


  useEffect(() => {
    getCartItems();
  }, []);


  const handleRemoveItem = (index) => {
    // Remove item from cart
    removeCartItem(items[index].phone);
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const HandleCheckout = async () => {
    // update stocks
    try {
      const response = await fetch(`http://oldphonedeals.onrender.com/cart/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: loginctx.LoginUserId,
        }),
      });
      const data = await response.json();
      
      
      if (data.msg.includes('Insufficient stock')|| data.msg.includes('Error')) {
        alert('Insufficient stock for phone');
      }else{
        alert('Transaction confirmed!');
        navigate('/');
        setItems([]);
        loginctx.setCartItems([]);
      }

    } catch (error) {
      alert('Insufficient stock for phone');
        // console.error('Error clear cart items:', error);
    }
};


  const handleConfirmTransaction = () => {
    HandleCheckout();
  };

  let totalPrice;
  if (items.length === 0) {
    totalPrice = 0;
  } else {
    totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Convert totalPrice to a number with 2 decimal places
  const formattedPrice = totalPrice.toFixed(2);

  



  return (
    <Box sx={{ margin: '20px' }}>
      <Button variant="contained" color="primary" onClick={handleBack}>
        Back
      </Button>
      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        {items.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ maxWidth: '400px', margin: 'auto' }}>
            <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '150px', // Adjust the desired height of the image container
                  marginBottom: '10px', // Add spacing between cards
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'auto', // Adjust the desired width of the image
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <CardContent>
                <Typography variant="h5">{item.title}</Typography>
                <Typography variant="subtitle1">{`Price: $${item.price.toFixed(2)}`}</Typography>
                <TextField
                  label="Quantity"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  inputProps={{
                    min: 0,
                    max: item.stock,
                    step: 1,
                  }}
                  fullWidth
                  margin="normal"
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" sx={{ marginTop: '20px' }}>
        {`Total Price: $${formattedPrice}`}
      </Typography>
      <Button
        variant="contained"
        color="success"
        onClick={handleConfirmTransaction}
        sx={{ marginTop: '20px' }}
      >
        Confirm Transaction
      </Button>
    </Box>
  );
};

export default CheckoutPage;
