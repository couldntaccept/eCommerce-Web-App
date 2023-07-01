import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

export default function SignUp() {

  const [message, setMessage] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const isEmailValid = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    if (!isEmailValid(email)) {
      setMessage('Please enter a valid email address.');
      setOpenDialog(true);
      return;
    }

    const password = data.get('password');
    if (!isPasswordValid(password)) {
      setMessage('Password must be at least 8 characters long, including a capital letter, a lower-case letter, a number, and a symbol.');
      setOpenDialog(true);
      return;
    }

    // Prepare the request payload
    const requestBody = {
      firstname: data.get('firstname'),
      lastname: data.get('lastname'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      // Send a POST request to the /auth/register endpoint
      const response = await fetch('https://oldphonedeals.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Handle the response
      if (response.ok) {
        // Registration successful (handle the response as needed, e.g., redirect to login page)
        setMessage('Registration successful, please check your email for verification link');
        setOpenDialog(true);
      } else {
        // Handle errors (e.g., email already exists)
        setMessage('Registration failed:' + await response.text());
        setOpenDialog(true);
      }
    } catch (error) {
      setMessage('Error while registering:' + error);
      setOpenDialog(true);
    }
  };

  return (
     <div>
                  
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="firstname"
              label="First Name"
              name="firstname"
              autoComplete="firstname"              
            />
              <TextField
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
              autoComplete="lastname"              
            />
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
              Sign Up
            </Button>

            <Dialog
              open={openDialog}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {message}
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  OK
                </Button>
              </DialogActions>
            </Dialog>

            <Grid container>
              <Grid item xs>
            
              </Grid>
            
            </Grid>
          </Box>
 
    
    </div>
  );
}