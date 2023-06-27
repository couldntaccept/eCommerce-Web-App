import React, { useState } from 'react';


/* THIS COMPONENT HAS BEEN REPLACED BY PhoneDialog.js & PhoneDialogReview.js components*/
/* THIS COMPONENT HAS BEEN REPLACED BY PhoneDialog.js & PhoneDialogReview.js components*/
/* THIS COMPONENT HAS BEEN REPLACED BY PhoneDialog.js & PhoneDialogReview.js components*/
/* THIS COMPONENT HAS BEEN REPLACED BY PhoneDialog.js & PhoneDialogReview.js components*/
/* THIS COMPONENT HAS BEEN REPLACED BY PhoneDialog.js & PhoneDialogReview.js components*/
/* THIS COMPONENT HAS BEEN REPLACED BY PhoneDialog.js & PhoneDialogReview.js components*/


function Review({ review }) {
  const [expanded, setExpanded] = useState(false);

  const handleShowMore = () => {
    setExpanded(!expanded);
  };

  const styles = {
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
  };

  return (
    <div key={review.id} style={styles.review}>
      <p>Reviewer: {review.reviewerfullname}</p>
      <p>Rating: {review.rating}</p>
      {review.comment.length > 200 ? (
        <div>
          {expanded ? (
            <>
              <p>{review.comment}</p>
              <button onClick={handleShowMore} style={styles.showMoreButton}>
                Show Less
              </button>
            </>
          ) : (
            <>
              <p>{review.comment.slice(0, 200)}</p>
              <button onClick={handleShowMore} style={styles.showMoreButton}>
                Show More
              </button>
            </>
          )}
        </div>
      ) : (
        <p>{review.comment}</p>
      )}
    </div>
  );
}

export default Review;
