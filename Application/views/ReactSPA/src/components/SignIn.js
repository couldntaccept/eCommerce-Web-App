import * as React from 'react';
import { Button, Typography, Alert, Snackbar, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LoginContext from '../store/LoginContext';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'


export default function SignIn(props) {
  const loginctx = useContext(LoginContext);

  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('error');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Prepare the request payload
    const requestBody = {
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      // Send a POST request to the /auth/login endpoint
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Handle the response
      if (response.ok) {

        const responseData = await response.json();
        const { token, firstName, lastName, email, userId } = responseData;

        try {
          const response = await fetch(`http://oldphonedeals.onrender.com/cart/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // need to be updated to the userid in context
              userId: userId
            }),
          });
          const data = await response.json();
          // Make sure cartItems is always an array

          if (data.msg !== 'Cart not found') {
            loginctx.LoginHandler(firstName, lastName, email, userId, token, data || []);

          } else {
            loginctx.LoginHandler(firstName, lastName, email, userId, token, []);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }

        // Call LoginHandler with email and token

        setMessage('Logged in successfully');
        setSeverity('success');
        setOpenSnackbar(true);

        
      } else {
        // Handle errors (e.g., invalid credentials)
        setMessage(await response.text());
        setSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setMessage('Error while logging in: ' + error.message);
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };




  return (


    <div>
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Typography
          component={Link}
          to="/reset-password"
          variant="contained"
        >
          Forget Your Password?
        </Typography>

      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>

  );
}