import * as React from 'react';
import Rating from '@mui/material/Rating';
import { useEffect } from 'react';

export default function ReviewRating(props) {
  const [value, setValue] = React.useState(2);

  useEffect (() => {
    
    setValue(props.rating)
  },[])

  return (


    <Rating sx={{ verticalAlign: 'text-bottom' }} size="small" name="read-only" value={value} readOnly />


  );
}