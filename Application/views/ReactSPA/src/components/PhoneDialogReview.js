import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ReviewRating from './ReviewRating';
import { useContext } from "react";
import LoginContext from '../store/LoginContext';

const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'primary.main',
    m: 1,
    border: 1,
    width: '5rem',
    height: '5rem',
};

export default function PhoneDialogReview(props) {
    const review = props.review

    const loginctx = useContext(LoginContext);


    const [hidden, sethidden] = useState(
        //false

        review !== undefined ? review.hasOwnProperty('hidden') : false

    )

    const [hidecolor, sethidecolor] = useState(

        (hidden ? "gray" : "black")


    )

    let userid = loginctx.LoginUserId
    let reviewerid
    if (review !== undefined) {
        reviewerid = review?.reviewerid

    }
    //Checks if the hidden property is there, if it is, then set the state to hidden
    /*
    if (review !== undefined) {
        if (review.hasOwnProperty('hidden')) {
            console.log("Has hidden property")
            if (hidden === false) {
                sethidden(true);
                sethidecolor("gray")
                console.log("Set hidden to true")
            }
        }
        else {

        }
    }
*/

    const [ShowMoreState, setShowMoreState] = useState(true)
    //const [HiddenState,setHiddenState] = useState()


    //Called when "Show More" button is clicked.. Shows the whole text
    const ShowMore = (comment) => {

        setShowMoreState(false);
    }

    //Called when "Show Less" button is clicked.. Hides the text
    const ShowLess = (comment) => {

        setShowMoreState(true);
    }

    //toggles the the 'hidden: field' on the review and changes the color to gray
    const ToggleHide = async () => {
        try {
            console.log("Sending POST to 127.0.0.1:4000/phones/review/sethidden")
            const response = await fetch('http://127.0.0.1:4000/phones/review/sethidden',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "phoneid": props.phoneid,
                        "indexnumber": props.indexnumber,
                        "userid": loginctx.LoginUserId,
                        "hide": !hidden
                    })
                }
            )
            const res = await response.json();

            if (res.hasOwnProperty('hidden')) {
                //if database returned hidden:"" then set the hidden state to true
                sethidden(true)
                sethidecolor("gray")
                console.log("State set to true")
            } else {
                //otherwise set it the hidden state as false
                sethidden(false)
                sethidecolor("")
                console.log("State set to false")
            }
            //Refresh the PhoneDialog
            if (props.setEffectCall !== undefined) {

                props.setEffectCall(props.EffectCall + 1)
            }


        } catch (err) {
            console.log(err)
        }
    }


    if (review !== undefined) {



        //If we are on the profile page,then skip the hide logic.
        if (props.profile !== true &&
            //If the comment has "Hidden" state, check if the user id matches the reviewer/seller id 
            (hidden === true &&
                (userid !== reviewerid && userid !== props.sellerid))) {
            return (
                <Box>
                    <Typography sx={{
                        fontWeight: "bold",
                        color: hidecolor
                    }}>
                        Comment Hidden: <ReviewRating rating={0}></ReviewRating>
                        <Typography sx={{ color: hidecolor }}>

                            This comment has been hidden by the seller/reviewer.
                        </Typography>
                        <p></p>
                    </Typography>
                </Box>

            )

        } else {
            return (
                <Box >
                    <Typography sx={{
                        fontWeight: "bold",
                        color: hidecolor
                    }}>

                        {review?.reviewer}

                        : <ReviewRating rating={review.rating} />
                        {((userid === reviewerid || userid === props.sellerid) ?
                            <Button variant="text" size="small" onClick={() => ToggleHide()}>

                                {hidden === false ? "Hide" : "Show"}

                            </Button>
                            : ""
                        )}
                    </Typography>

                    <Typography sx={{ color: hidecolor }}>
                        {
                            review?.comment?.length > 200 ?

                                (ShowMoreState === true ?
                                    (
                                        <div>
                                            {review.comment.substr(0, 200)} ...

                                            <Button textTransform="lowercase" onClick={() => ShowMore(review.comment)}>
                                                <Typography>Show More</Typography>
                                            </Button>
                                        </div>
                                    ) :
                                    <div>
                                        {review.comment}
                                        <Button onClick={() => ShowLess(review.comment)}>Show Less</Button>
                                    </div>
                                )
                                : review.comment
                        }


                    </Typography>
                    <p></p>
                </Box >


            )
        }
    }
    //}
}