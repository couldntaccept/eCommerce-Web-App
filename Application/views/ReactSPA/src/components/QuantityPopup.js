import React, { useState, useEffect, useContext } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import LoginContext from '../store/LoginContext';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';


const QuantityPopup = ({ title, id, item, onAddToCart, props, State, PhoneItem }) => {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [stock, setStock] = useState(0);
    const [ItemQuantity, setItemQuantity] = useState(0);
    const [phoneData, setPhoneData] = useState(null);
    const loginctx = useContext(LoginContext);
    const navigate = useNavigate();
    const handleClose = () => {
        setOpen(false);
    };

    const handleAddToCart = async () => {
        console.log("selected quantity: ", quantity);
        if (quantity > stock) {
            alert('Not enough stock!');
            return;
        }
        try {
            const response = await fetch(`http://oldphonedeals.onrender.com/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // need to be updated to the userid in context
                    userId: loginctx.LoginUserId,
                    phoneId: phoneData._id,
                    quantity: quantity,
                    price: phoneData.price,
                    image: phoneData.image,
                    stock: phoneData.stock,
                    title: phoneData.title,
                }),
            });

        } catch (error) {
            console.error('Error adding item to cart:', error);
        }

        // update context if needed
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

            loginctx.setCartItems(data);
            console.log("cartItems:", loginctx.cartItems);

        } catch (error) {
            console.error('Error update in cart:', error);
        }

        console.log('Item need to add into cart:', phoneData, quantity);
        handleClose();
    };

    const createMenuItems = () => {
        const items = [];
        if (stock === 0) {
            items.push(<MenuItem key={0} value={0}>0</MenuItem>);
        }
        for (let i = 1; i <= stock; i++) {
            items.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
        }
        return items;
    };

    const handleNavigate = async () => {
        
        try {
            console.log("Sending request to http://oldphonedeals.onrender.com/phones/view/?id=" + id)
            const response = await fetch('http://oldphonedeals.onrender.com/phones/view/?id=' + id)
            const data = await response.json();
            setPhoneData(data[0]);
            loginctx.setLastOpen(data[0]);
        } catch (err) {
            console.error(err); 
        }
    
        navigate("/signin"); 
    }


    const grabById = async () => {

        try {
            console.log("Sending request to http://oldphonedeals.onrender.com/phones/view/?id=" + id)
            const response = await fetch('http://oldphonedeals.onrender.com/phones/view/?id=' + id)
            const data = await response.json();
            setPhoneData(data[0]);
            if (data[0].stock > 0) {
                setStock(data[0].stock)
            } else {
                setStock(data[0].stock)
                alert('No stock available!');
                handleClose();
            }
        } catch (err) {
            console.error(err);
        }

    }

    const getitemQuantity = async () => {
        if(loginctx.LoginStatus !== false && loginctx.LoginUserId !== ''){
            try {
                const response = await fetch("http://oldphonedeals.onrender.com/cart/quantity", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: loginctx.LoginUserId,
                        phoneId: id,
                    }),
                });
                const data = await response.json();
                setItemQuantity(data);

            } catch (err) {
                console.error(err);
            }
        }
        else{
            setItemQuantity(0)
        }
    }

    // useEffect(async () => {
    //     grabById();
    //     // if (open === true){
    //     //     try {
    //     //         console.log("Sending request to http://oldphonedeals.onrender.com/phones/view/?id=" + id)
    //     //         const response = await fetch('http://oldphonedeals.onrender.com/phones/view/?id=' + id)
    //     //         const data = await response.json();
    //     //         setPhoneData(data[0]);
    //     //     } catch (err) {
    //     //         console.error(err); 
    //     //     }
    //     // }
    // }, [id])

    useEffect(() => {
        
        getitemQuantity();
        
    }, [open])


    const handleClickOpen = async () => {
        grabById();
        getitemQuantity();
        setOpen(true);
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* <IconButton color="primary" onClick={handleClickOpen}>
        <AddShoppingCartIcon />
        </IconButton> */}

        <TextField
            label="Quantity in Cart"
            variant="outlined"
            value={ItemQuantity}
            disabled
            size="small"
            style={{ marginLeft: '10px', marginRight: '10px' }}
        />
        {loginctx.LoginStatus === false && (
            <Button variant="contained" onClick={handleNavigate}>Add to Cart</Button>
        )}
        {loginctx.LoginStatus === true && (
            <Button variant="contained" onClick={handleClickOpen}>Add to Cart</Button>
        )}

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Select Quantity</DialogTitle>
            <DialogContent>
            <FormControl fullWidth>
                {/* <InputLabel id="quantity-label">Quantity</InputLabel> */}
                <Select
                labelId="quantity-label"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                >
                {createMenuItems()}
                </Select>
            </FormControl>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            </DialogActions>
        </Dialog>
    </div>
    );
};

export default QuantityPopup;
