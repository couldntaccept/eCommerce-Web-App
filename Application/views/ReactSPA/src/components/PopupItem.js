import React, { useContext, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Review from './PopupItemReview';
import LoginContext from '../store/LoginContext';
import QuantityPopup from './QuantityPopup';

export default function PopupDialog(props) {
    const { item, open, onClose } = props;
    const [expandedReviews, setExpandedReviews] = useState([]);
    // const [phoneData, setPhoneData] = useState(null);
    const [displayedReviewsCount, setDisplayedReviewsCount] = useState(3);
    const [quantityPopupOpen, setQuantityPopupOpen] = useState(false);
    const loginctx = useContext(LoginContext);

    const handleShowMoreReviews = (reviewId) => {
        setExpandedReviews((prevState) => {
        const index = prevState.indexOf(reviewId);
        if (index === -1) {
            return [...prevState, reviewId];
        } else {
            return prevState.filter((id) => id !== reviewId);
        }
        });
    };

    const handleLoadMoreReviews = () => {
        setDisplayedReviewsCount(displayedReviewsCount + 3);
    };

    const onAddToCart = () => {
        // Adding the item to the cart
        setQuantityPopupOpen(true);
        console.log('Item need to add into cart:', item);
    };

  

  const styles = {
    title: {
      textAlign: 'center',
      color: '#3f51b5',
    },
    image: {
      width: '50%',
      height: 'auto',
      borderRadius: '4px',
      marginBottom: '10px',
    },
    review: {
      marginTop: '10px',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
    },
    showMoreButton: {
      border: '1px solid #3f51b5',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer',
      color: '#3f51b5',
      textDecoration: 'none',
      display: 'inline-block',
      marginTop: '5px',
    },
    noReviews: {
      fontStyle: 'italic',
    },
    // addToCartButton: {
    //     backgroundColor: '#4287f5',
    //     color: 'white',
    //     borderRadius: '4px',
    //     padding: '5px 10px',
    //     cursor: 'pointer',
    //     display: 'inline-block',
    //     marginTop: '5px',
    //     marginBottom: '10px',
    //     marginLeft: '50px',
    // },
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={styles.title}>{item?.title}</DialogTitle>
      <DialogContent>
        <img
          src={item?.image}
          alt={item?.title}
          style={styles.image}
        />
        
        <QuantityPopup
            title={item?.title}
            id={item?._id}
            open={quantityPopupOpen}
            onClose={() => setQuantityPopupOpen(false)}
        />
        
        <DialogContentText>
          <p>Title: {item?.title}</p>
          <p>Brand: {item?.brand}</p>
          <p>Available Stock: {item?.stock}</p>
          <p>Seller's Full Name: {item?.sellerfullname}</p>
          <p>Price: ${item?.price}</p>
          <p>Reviews:</p>
          
          {item?.reviews && item?.reviews.length > 0 ? (
          item?.reviews.slice(0, displayedReviewsCount).map((review) => (
            <Review
              key={review.id}
              review={review}
              expandedReviews={expandedReviews}
              handleShowMoreReviews={handleShowMoreReviews}
            />
          ))
        ) : (
                <p style={styles.noReviews}>No reviews available.</p>
            )}
            {item?.reviews.length > displayedReviewsCount && (
            <button onClick={handleLoadMoreReviews} style={styles.showMoreButton}>
                Show More Reviews
            </button>
            )}
            {/* <QuantityPopup stock={item.stock} open = {dialogOpen} onClose = {() => setDialogOpen(false)}
            /> */}
                
        </DialogContentText>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
