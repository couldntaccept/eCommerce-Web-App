import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import LoginContext from '../store/LoginContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';


export default function TopBar(props) {
  const navigate = useNavigate();
  const loginctx = useContext(LoginContext);
  const [cartItems, setCartItems] = useState([]);


  const fetchCartItems = async () => {
    try {
      // need to be upated to context      

      const response = await fetch(`http://127.0.0.1:4000/cart/user`, {
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
        setCartItems(data);
        loginctx.setCartItems(data);
      } else {
        setCartItems([]);
        loginctx.setCartItems([]);
      };

      // update context if needed
      // loginctx.setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };


  useEffect(() => {
    if (loginctx.LoginStatus) {
      fetchCartItems();
    }
  }, [loginctx.LoginStatus]);

  useEffect(() => {
    console.log('loginctx.cartItems:', loginctx.cartItems);
  }, [loginctx.cartItems]);


  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleLogout = () => {
    setOpenDialog(true);

  };

  const confirmLogout = () => {
    loginctx.LogoutHandler();
    setOpenDialog(false);
    setHomeState()
  };
  const setHomeState = () => {
    props.setState("home");
  }

  const startSearch = async () => {
    try {

      props.setState("loading");
      console.log("Sending request to http://127.0.0.1:4000/phones/search?title=" + props.SearchValue)
      const response = await fetch('http://127.0.0.1:4000/phones/search?title=' + props.SearchValue)
      const data = await response.json();


      //Loop through the data and...
      for (let i = 0; i < data.length; i++) {
        //clean empty {} reviews
        if (Object.keys(data[i].reviews[0]).length === 0) {
          data[i].reviews.length = 0
        }

      }

      //remove disabled phones
      let nodisabled = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i].hasOwnProperty("disabled")) {
          nodisabled.push(data[i])
        }
      }


      props.setState("search");
      props.setSearchedValue(props.SearchValue)
      props.setSearchedPhoneData(nodisabled);


    } catch (err) {
      //Log the error and then return home
      console.log(err)
      props.setState("home");

    }
  }



  return (



    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>


          <Typography
            variant="h6"
            noWrap

            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <Button
              onClick={setHomeState}
              variant="contained"
              sx={
                { "&:hover": { backgroundColor: "transparent" } }
              }
              disableRipple
              disableFocusRipple
            >
              OldPhoneDeals
            </Button>

          </Typography>

          <TextField id="Search" name="Search"
            onChange={(newValue) => props.setSearchValue(newValue.target.value)}
            sx={{ backgroundColor: '#5ca0e3' }} />
          <Button variant="contained" onClick={startSearch}>Search</Button>




          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            {loginctx.LoginStatus === false &&
              <div>
                <Button component={Link} go to="/SignIn" variant="contained">Log in</Button>
                <Button component={Link} go to="/SignUp" variant="contained">Sign Up</Button>
              </div>
            }
            {loginctx.LoginStatus === true &&
              <div>
                Logged in as {loginctx.LoginFirstName + " " + loginctx.LoginLastName}&nbsp;
                <Button onClick={handleLogout} variant="contained">Log Out</Button>

                <Button component={Link} to="/profile" variant="contained">Profile</Button>
              </div>
            }

          </Box>
          {loginctx.LoginStatus === false && (
            <Button
              startIcon={<ShoppingCartIcon />}
              onClick={() => (window.location.href = '/signin')}
              variant="contained"
            >
              0
            </Button>
          )}
          {loginctx.LoginStatus === true && (
            <Button
              startIcon={<ShoppingCartIcon />}
              onClick={() => (window.location.href = '/checkout')}
              variant="contained"
            >
              <span>{loginctx.cartItems.length > 0 ? loginctx.cartItems.length : 0}</span>
            </Button>
          )}

        </Toolbar>

        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to log out?
          </DialogTitle>
          <DialogActions>
            <Button onClick={confirmLogout} color="primary">
              Yes
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>

      </AppBar>

    </Box>


  );
}