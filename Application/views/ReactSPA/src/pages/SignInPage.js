import * as React from 'react';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Box from '@mui/material/Box';
import SignIn from '../components/SignIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Link} from 'react-router-dom';
import SignInToggle from '../components/SignInToggle';
import SignUp from '../components/SignUp';
import Container from '@mui/material/Container';
import { CssBaseline } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useContext, useEffect } from 'react';
import LoginContext from '../store/LoginContext';

const theme = createTheme();

export default function SignInPage(props) {
 
  const [ToggleValue,setToggleValue] = useState(props.value);
  const loginctx = useContext(LoginContext);
  

  

  const Toggle = (value)=>{
        setToggleValue(value);    
    }

    return (
      <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
          }}
        ></Box>
        <Button component = {Link} to="/" variant = "contained" ><ArrowBackIcon/>Go Back</Button>
       
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
        
        <Box sx={{marginTop:5}}></Box>
        
        {/*When the URL routes to either /signin or /signout, this is value passed to the SignInToggle component*/}
                <SignInToggle onToggle={Toggle} startAlignment = {props.value}/>
                {ToggleValue ==="SignIn" ? <SignIn/> : <SignUp/>}
       
    </Box>
      </Container>
    </ThemeProvider>
  );
}