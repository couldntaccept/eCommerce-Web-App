import React, { useState, createContext } from 'react';

const LoginContext = createContext({
  LoginStatus: false,
  LoginFirstName: '',
  LoginLastName: '',
  LoginEmail: '',
  LoginUserId: '',
  LoginToken: '',
  LoginHandler: () => {},
  LogoutHandler: () => {},
  fetchUserDetails: () => {},
  cartItems: [],
  setCartItems: () => {},
  lastOpen: '',
  setLastOpen: () => {},
  // lastState: '',
  // setLastState: () => {},
});

export const LoginProvider = (props) => {

  return (
    <LoginContext.Provider
      value={{
        LoginStatus: props.loginStatus,
        LoginFirstName: props.loginFirstName,
        LoginLastName: props.loginLastName,
        LoginEmail: props.loginEmail,
        LoginUserId: props.loginUserId,
        LoginToken: props.loginToken,
        LoginHandler: props.LoginHandler,
        LogoutHandler: props.LogoutHandler,
        cartItems: props.cartItems,
        setCartItems: props.setCartItems,
        fetchUserDetails: props.fetchUserDetails,
        lastOpen: props.lastOpen,
        setLastOpen: props.setLastOpen,
        // lastState: props.lastState,
        // setLastState: props.setLastState,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
