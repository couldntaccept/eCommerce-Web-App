import React, { useEffect, useState } from 'react';
import LoginContext from '../store/LoginContext';
import { useContext } from 'react';
import { Button } from '@mui/material';
import PhoneDialogReview from './PhoneDialogReview';

export const ViewComments = () => {
  const [phoneComments, setPhoneComments] = useState([]);
  const loginctx = useContext(LoginContext);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`https://oldphonedeals.onrender.com/phones/search?seller=${loginctx.LoginUserId}`);
      const data = await response.json();

      for (let i = 0; i < data.length; i++) {
        //clean empty {} reviews
        if (Object.keys(data[i].reviews[0]).length === 0) {
          data[i].reviews.length = 0
        }
      }

      setPhoneComments(data);
    };

    fetchComments();
  }, []);


  return (
    <div>
      <h2>Comments</h2>
      {phoneComments.map((phone, phoneIndex) => (
        <div key={phoneIndex}>
          <h3>{phone.title}</h3>
          {phone.reviews.map((comment, commentIndex) => (


            <PhoneDialogReview key={commentIndex}
              indexnumber={commentIndex}
              review={comment}
              phoneid={phone._id}
              sellerid={loginctx.LoginUserId}
              profile={true}
            />

          ))}
        </div>
      ))}
    </div>
  );
}

export default ViewComments;
