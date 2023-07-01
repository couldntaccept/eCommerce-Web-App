import React, { useState } from 'react';
import { TextField, Button, Typography, Snackbar, Grid, Box } from '@mui/material';
import { Alert } from '@mui/material';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://oldphonedeals.onrender.com/auth/request-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Password reset email sent');
        setSeverity('success');
      } else {
        setMessage(response.statusText || 'Error sending password reset email');
        setSeverity('error');
      }
    } catch (error) {
      setMessage('Error sending password reset email');
      setSeverity('error');
    }
    setOpenSnackbar(true);
  };


  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>

        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
          }}
        >
          <Button component = {Link} to="/signin" variant = "contained" ><ArrowBackIcon/>Go Back</Button>

        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
          }}
        >

          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Send Reset Link
            </Button>
          </form>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={severity}>
              {message}
            </Alert>
          </Snackbar>
        </Box>
      </Grid>
    </Grid>
  );
}
