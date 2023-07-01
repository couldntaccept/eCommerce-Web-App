import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import LoginContext from '../store/LoginContext';
import { useContext } from 'react';

export const EditProfile = ({ firstName, lastName, email, setSnackbarOpen}) => {
    const [updatedFirstName, setUpdatedFirstName] = useState(firstName);
    const [updatedLastName, setUpdatedLastName] = useState(lastName);
    const [updatedEmail, setUpdatedEmail] = useState(email);
    const [password, setPassword] = useState('');

    const loginctx = useContext(LoginContext);

    const handleProfileUpdate = async (event) => {
        const requestBody = {
            email: updatedEmail,
            firstName: updatedFirstName,
            lastName: updatedLastName,
            password: password,
            userId: loginctx.LoginUserId,
        };

        event.preventDefault();
        try {
            const response = await fetch('https://oldphonedeals.onrender.com:4000/users/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok){
                setSnackbarOpen('Profile updated successfully');
                loginctx.fetchUserDetails(loginctx.LoginUserId);
            } else {
                setSnackbarOpen(await response.text() || 'An error occurred');
            }
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
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="fname"
                value={updatedFirstName}
                defaultValue={loginctx.LoginFirstName}
                onChange={(e) => setUpdatedFirstName(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={updatedLastName}
                defaultValue={loginctx.LoginLastName}
                onChange={(e) => setUpdatedLastName(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={updatedEmail}
                defaultValue={loginctx.LoginEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleProfileUpdate}
            >
                Update Profile
            </Button>
        </div>
    );
};

export default EditProfile;
