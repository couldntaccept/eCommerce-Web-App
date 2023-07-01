import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Dialog, Hidden } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import PhoneDialogReview from './PhoneDialogReview';
import PhoneDialogEnter from './PhoneDialogEnter';
import { useState, useEffect, useContext } from 'react';
import LoginContext from '../store/LoginContext';
import QuantityPopup from './QuantityPopup';


const style = {

  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  //alignItems: "center",
  boxShadow: 24,
  p: 4,
  //display : "grid",
  // justifyContent : "flex-start"
};

export default function PhoneDialog(props) {

  const [State, setState] = useState(props.State)
  //setState(props.State)

  //Triggers a reload of the review item state
  const [EffectCall, setEffectCall] = useState(0)

  const loginctx = useContext(LoginContext);
  //Start with showing the first 3 reviews
  const [NumberReviewsShown, setNumberReviewsShown] = useState(3);

  //This state is the reviews currently shown on the page
  const [ReviewsShown, setReviewsShown] = useState([]);

  //This array captures all reviews
  const [AllReviews, setAllReviews] = useState([])

  //This sets the object
  const [Phone, setPhone] = useState(props.row)
  //let AllReviews = []

  if (props.open === true) {

  }

  //State for quantity popup
  const [quantityPopupOpen, setQuantityPopupOpen] = useState(false);

  useEffect(() => {
    if (props.open === true) {
      async function getPhone() {
        try {
          console.log("Sending request to http://oldphonedeals.onrender.com/phones/view/?id=" + props.row._id)
          const response = await fetch('http://oldphonedeals.onrender.com/phones/view/?id=' + props.row._id)
          const data = await response.json();


          console.log("Response received.")
          //Set allreviews to be the data retrieved from server


          //Clean Empty Reviews
          for (let i = 0; i < data.length; i++) {
            if (Object.keys(data[i].reviews[0]).length === 0) {
              data[i].reviews.length = 0
            }
          }

          setAllReviews(data[0].reviews)
          setReviewsShown([])
          setPhone(data[0])

        } catch (err) {
          //Log the error
          console.log(err)

        }
      }
      getPhone();

    }

    //When the dialog closes, reset the number of reviews displayed
    if (props.open === false) {
      setNumberReviewsShown(3)
    }
    //EffectCall is triggered when a user posts a comment, hides/shows a comment, or opens/closes dialog.
  }, [EffectCall, props.open])
  useEffect(() => {
    if (props.open === true) {

      //Define an empty array
      const TempReviews = []

      //if there are reviews retrieved from the server,then push them into the TempReivews variable
      if (AllReviews !== undefined && AllReviews.length !== 0) {

        //Push the number of reviews into the tempreviews array
        for (let i = 0; i < NumberReviewsShown; i++) {

          console.log("Pushed")
          TempReviews.push(AllReviews[i])
        }
      }
      //If there are no reviews, clear the reviewsshown variable, 
      //otherwise set the reviews shown to the temp reviews.
      if (AllReviews === undefined || AllReviews.length === 0) {

        ReviewsShown.length = 0;
        setReviewsShown(ReviewsShown)

      } else {

        setReviewsShown(TempReviews)
      }
      //setReviewsShown(TempReviews)


    }
    if (props.open === false) {
      setReviewsShown([])

    }

  }, [NumberReviewsShown, AllReviews, Phone, props.row, EffectCall, props.open])


  const IncreaseReviews = () => {
    if (AllReviews.length > NumberReviewsShown) {

      setNumberReviewsShown(NumberReviewsShown + Math.min(3, (AllReviews.length - NumberReviewsShown)))
    }

  }

  return (
    <div>

      <Dialog
        sx={{ margin: "10" }}
        //fullWidth = "true"
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        scroll="paper"
        maxWidth="lg"
      >
        {/*<Box sx={style}>*/}
        <Grid
          container
          spacing={-4}
        /* //Show the borders to do styling
                    sx={{
                      '--Grid-borderWidth': '1px',
                      borderTop: 'var(--Grid-borderWidth) solid',
                      borderLeft: 'var(--Grid-borderWidth) solid',
                      borderColor: 'divider',
                      '& > div': {
                        borderRight: 'var(--Grid-borderWidth) solid',
                        borderBottom: 'var(--Grid-borderWidth) solid',
                        borderColor: 'divider',
                      },
                    }}
        
                  */
        >

          <Grid xs={9}>
            <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
              {Phone.brand}
            </Typography>
          </Grid>
          {loginctx.LoginStatus === true &&
            <Grid xs={3}>
              Logged in as {loginctx.LoginFirstName + " " + loginctx.LoginLastName}

            </Grid>
          }
          <Grid xs={12}>
            <Typography id="modal-modal-description" >
              {Phone.title}
            </Typography>
          </Grid>

          <Grid xs={12} justifyContent="center" display="flex">
            <img src={"/images/" + Phone.brand + ".jpeg"} alt={Phone.brand} width="150" height="170" />
          </Grid>

          <Grid xs={9} >
            <Typography variant="body1" >
              Stock: {Phone.stock} Price: ${Phone.price.toFixed(2)} Seller: {Phone.sellerfullname}
            </Typography>
            <Grid />
          </Grid>
          <Grid xs={3} justifyContent="end" display="flex">
            <QuantityPopup
              title={Phone?.title}
              id={Phone?._id}
              item={Phone}
              open={quantityPopupOpen}
              onClose={() => setQuantityPopupOpen(false)}
              State={State}
              PhoneItem={Phone}
            />

          </Grid>



          {loginctx.LoginStatus === true &&
            //Only show the post box when user is logged in
            <Grid xs={12}>
              <p></p>
              <PhoneDialogEnter phone={Phone}
                EffectCall={EffectCall}
                setEffectCall={setEffectCall}
                NumberReviewsShown={NumberReviewsShown}
                setNumberReviewsShown={setNumberReviewsShown}
              />
              <p></p>
            </Grid>
          }


          <Grid xs={12}>
            <Typography sx={{ textDecorationLine: 'underline' }} fontWeight="bold">{Phone.reviews.length} Reviews:</Typography>
          </Grid>


          {ReviewsShown.map((review, index) => (
            <Grid xs={12}>
              <PhoneDialogReview key={Math.random()}
                indexnumber={index}
                review={review}
                phoneid={props.row._id}
                sellerid={props.row.seller}
                EffectCall={EffectCall}
                setEffectCall={setEffectCall} />
            </Grid>

          ))}

        </Grid>

        {
          ReviewsShown < AllReviews &&
          <Button variant="contained" onClick={IncreaseReviews}>See more reviews</Button>
        }


        {/*</Box>*/}



      </Dialog>
    </div>
  );
}