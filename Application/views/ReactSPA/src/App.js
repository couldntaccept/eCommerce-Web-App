import SignInPage from './pages/SignInPage';
import CheckoutPage from './pages/CheckoutPage';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';
import UserPage from './pages/UserPage';
import Main from './pages/Main';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginContext from './store/LoginContext';
import { useState } from 'react';
import { set } from 'mongoose';

const router = createBrowserRouter([
  { path: '/', element: <Main /> },
  { path: '/signin', element: <SignInPage value="SignIn" /> },
  { path: '/signup', element: <SignInPage value="SignUp" /> },
  { path: '/checkout', element: <CheckoutPage value="SignIn" /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/new-password/:token', element: <NewPassword /> },
  { path: '/profile', element: <UserPage /> },
])

function App() {
  // acutal login status
  const [loginStatus, setLoginStatus] = useState(localStorage.getItem("loginStatus") === "true");
  const [loginFirstName, setLoginFirstName] = useState(localStorage.getItem("loginFirstName") || '');
  const [loginLastName, setLoginLastName] = useState(localStorage.getItem("loginLastName") || '');
  const [loginEmail, setLoginEmail] = useState(localStorage.getItem("loginEmail") || '');
  const [loginUserId, setLoginUserId] = useState(localStorage.getItem("loginUserId") || '');
  const [loginToken, setLoginToken] = useState(localStorage.getItem("loginToken") || '');
  const [cartItems, setCartItems] = useState(localStorage.getItem("cartItems")||[]);
  const [lastOpen, setLastOpen] = useState(localStorage.getItem("lastOpen")||'');
  const [lastState, setLastState] = useState(localStorage.getItem("lastState")||'');




  const LoginHandler = (firstName, lastName, email, userId, token, cartItems) => {
    setLoginStatus(true);
    setLoginFirstName(firstName);
    setLoginLastName(lastName);
    setLoginEmail(email);
    setLoginUserId(userId);
    setLoginToken(token);
    setCartItems(cartItems);
    

    localStorage.setItem("loginStatus", true);
    localStorage.setItem("loginFirstName", firstName);
    localStorage.setItem("loginLastName", lastName);
    localStorage.setItem("loginEmail", email);
    localStorage.setItem("loginUserId", userId);
    localStorage.setItem("loginToken", token);
    localStorage.setItem("cartItems", cartItems);
    
  };

  const LogoutHandler = () => {
    setLoginStatus(false);
    setLoginFirstName('');
    setLoginLastName('');
    setLoginEmail('');
    setLoginUserId('');
    setLoginToken('');
    setCartItems([]);
    setLastOpen('');
    setLastState('');
    localStorage.clear();
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`https://oldphonedeals.onrender.com/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userDetails = await response.json();
        setLoginFirstName(userDetails.firstname);
        setLoginLastName(userDetails.lastname);
        setLoginEmail(userDetails.email);

        localStorage.setItem("loginFirstName", userDetails.firstname);
        localStorage.setItem("loginLastName", userDetails.lastname);
        localStorage.setItem("loginEmail", userDetails.email);
        
        try {
          const response = await fetch(`https://oldphonedeals.onrender.com/cart/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // need to be updated to the userid in context
                userId: loginUserId 
            }),
          });
          const data = await response.json();
          // Make sure cartItems is always an array
          
          if (data.msg !== 'Cart not found') {
            localStorage.setItem("cartItems", data);
          }else{
            localStorage.setItem("cartItems", []);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    
  };



  return (
    <LoginContext.Provider
      value={{
        LoginStatus: loginStatus,
        LoginFirstName: loginFirstName,
        LoginLastName: loginLastName,
        LoginEmail: loginEmail,
        LoginUserId: loginUserId,
        LoginToken: loginToken,
        LoginHandler: LoginHandler,
        LogoutHandler: LogoutHandler,
        fetchUserDetails: fetchUserDetails,
        cartItems: cartItems,
        setCartItems: setCartItems,
        lastOpen: lastOpen,
        setLastOpen: setLastOpen,
        lastState: lastState,
        setLastState: setLastState,
      }}>

      <RouterProvider router={router} />

    </LoginContext.Provider>

  )

}

export default App;
