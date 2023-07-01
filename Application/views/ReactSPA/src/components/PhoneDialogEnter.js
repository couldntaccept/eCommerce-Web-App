import { Box, TextField, Button } from "@mui/material"
import RatingPost from "./RatingPost"
import LoginContext from '../store/LoginContext';
import { useState, useContext } from 'react';

export default function PhoneDialogEnter(props) {
    const loginctx = useContext(LoginContext);

    const [ReviewValue, setReviewValue] = useState("");
    const [Rating, setRating] = useState(0)
    const [Loading, setLoading] = useState(false)
    const [PostButtonVariant, setPostButtonVariant] = useState("contained")
    const postReview = async () => {


        /**********The Post function comment has been disabled temporarily as it is not fully working **********/
        try {
            setLoading(true)
            setPostButtonVariant("disabled")
            console.log("Sending POST to oldphonedeals.onrender.com/phones/review")
            const response = await fetch('https://oldphonedeals.onrender.com/phones/review',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "phoneid": props.phone._id,
                        "userid": loginctx.LoginUserId,
                        "rating": Rating,
                        "comment": ReviewValue
                    })
                }
            )
            const res = await response;
            props.setEffectCall(props.EffectCall + 1)
            props.setNumberReviewsShown(props.NumberReviewsShown + 1)
            setReviewValue("")
            setLoading(false)
            setPostButtonVariant("contained")
        } catch (err) {
            console.log(err)
            setLoading(false)
            setPostButtonVariant("contained")
        }
        /***********************************************/
    }


    return (
        <Box>

            <TextField
                id="outlined-multiline-static"
                label="Post a review"
                multiline
                rows={2}
                fullWidth
                value={ReviewValue}
                onChange={(event) => { setReviewValue(event.target.value) }}
                placeholder=""
            />

            <RatingPost setRating={setRating} />
            <p></p>
            <Button onClick={postReview} disabled={ReviewValue === ''} variant={PostButtonVariant}> Post Review</Button>
        </Box>
    )

}