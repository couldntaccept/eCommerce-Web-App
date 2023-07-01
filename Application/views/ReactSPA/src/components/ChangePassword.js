import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import LoginContext from '../store/LoginContext';
import { useContext } from 'react';

export const ChangePassword = ({ setSnackbarOpen }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const loginctx = useContext(LoginContext);

    const isPasswordValid = (password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    };
  
    const handlePasswordChange = async () => {

        if (!isPasswordValid(newPassword)) {
          setSnackbarOpen('Password must be at least 8 characters long, including a capital letter, a lower-case letter, a number, and a symbol.');
          return;
        }

        try {
          const response = await fetch('https://oldphonedeals.onrender.com:4000/users/changePassword', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',  
              },
              body: JSON.stringify({ currentPassword, newPassword, userId: loginctx.LoginUserId}),
          });
      
          if (response.ok) {
            setSnackbarOpen('Password changed successfully');
          }else{
            setSnackbarOpen(await response.text());
            setSnackbarOpen('Password change failed');
          }

          // Clear the input fields
          setCurrentPassword('');
          setNewPassword('');
        } catch (error) {
          setSnackbarOpen('An error occurred');
        }
      };
      

    return (
        <div>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="currentPassword"
                label="Current Password"
                type="password"
                id="currentPassword"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
            >
                Confirm
            </Button>
        </div>
    );
};

export default ChangePassword;
