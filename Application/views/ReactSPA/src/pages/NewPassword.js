import React, { useState } from 'react';
import { TextField, Button, Typography, Snackbar, Grid, Box } from '@mui/material';
import { Alert } from '@mui/material';
import { useParams } from 'react-router-dom';



export default function NewPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const { token } = useParams();

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const isPasswordValid = (password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    };

    const requestBody = {
        token: token,
        newPassword: password
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isPasswordValid(password)) {
            setMessage('Password must be at least 8 characters long, including a capital letter, a lower-case letter, a number, and a symbol.');
            setSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords don't match");
            setSeverity('error');
            setOpenSnackbar(true);
            return;
        } 

        try {
            const response = await fetch('https://oldphonedeals.onrender.com/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setMessage('Password updated successfully');
                setSeverity('success');
            } else {
                setMessage(await response.text() || 'Error updating password');
                setSeverity('error');
            }
        } catch (error) {
            setMessage('Error updating password');
            setSeverity('error');
        }
        setOpenSnackbar(true);
    };
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
            }}
          >
            <Typography component="h1" variant="h5">
              Set New Password
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mt: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Update Password
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
