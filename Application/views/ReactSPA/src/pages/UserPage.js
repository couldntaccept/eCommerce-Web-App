import React, { useState, useContext } from 'react';
import { Grid, Box, Typography, Snackbar, Button, Tabs, Tab, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import LoginContext from '../store/LoginContext';
import { useNavigate, Link} from 'react-router-dom';
import ManageListings from '../components/ManageListings';
import ViewComments from '../components/ViewComments';
import ChangePassword from '../components/ChangePassword';
import EditProfile from '../components/EditProfile';

export default function UserPage() {
  const navigate = useNavigate();
  const loginctx = useContext(LoginContext);
  const [tabIndex, setTabIndex] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const firstName = loginctx.LoginFirstName;
  const lastName = loginctx.LoginLastName;
  const email = loginctx.LoginEmail;



  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };


  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSignOut = () => {
    loginctx.LogoutHandler();
    navigate('/');
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item>
        <Button component = {Link} to="/" variant = "contained" ><ArrowBackIcon/>Go Back</Button>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            User Page - {loginctx.LoginFirstName + " " + loginctx.LoginLastName}
          </Typography>
          <Paper square>
            <Tabs
              value={tabIndex}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
            >
              <Tab label="Edit Profile" />
              <Tab label="Change Password" />
              <Tab label="Manage Listings" />
              <Tab label="View Comments" />
            </Tabs>
          </Paper>
          {tabIndex === 0 && (
            <div>
              <EditProfile setSnackbarOpen={handleSnackbarOpen} firstName={firstName} lastName={lastName} email={email} />
            </div>
          )}
          {tabIndex === 1 && (
            <div>
              <ChangePassword setSnackbarOpen={handleSnackbarOpen} />
            </div>
          )}
          {tabIndex === 2 && (
            <div>
              <ManageListings setSnackbarOpen={handleSnackbarOpen} />
            </div>
          )}
          {tabIndex === 3 && (
            <div>
              <ViewComments setSnackbarOpen={handleSnackbarOpen} />
            </div>
          )}

          <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ mt: 2 }}>
            Sign Out
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            action={
              <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />

        </Box>
      </Grid>
    </Grid>
  );


}
