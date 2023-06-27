import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
function valuetext(value) {
  return `${value}°C`;
}
const minDistance = 10;
export default function RangeSlider(props) {

    let minPrice = 0
    let maxPrice = 0
        let prices = []
        for(let i of props.SearchedPhoneData){
        prices.push(Number(i.price))
         minPrice = Math.floor(Math.min(...prices))
        maxPrice = Math.ceil(Math.max(...prices))
        }

//set the minimum price and maximum price as the default
  const [PriceRange, setPriceRange] = useState([minPrice, maxPrice]);

  //set the filter every time a new search occurs
  useEffect(()=>{
//PriceRange is updated when the user drags the slider. This does NOT update the phone table. 
//The phone table updates when the user releases the mouse.
    props.setPriceRangeFilter([minPrice,maxPrice])
    console.log("Adjusting the filter due to new search")
  },props.SearchedPhoneData)
  
  const value1 = PriceRange;
  const setValue1 = setPriceRange;

//Called when user drags the mouse
  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  //Called when user releases the mouse on the range slider
  const handleChangeCommit = ()=>{
    props.setPriceRangeFilter(value1)
    
  }

  
  return (

    <Box sx={{ width: 300 }}>
        <Typography variant = "h6">Price Range: ${value1[0]} to ${value1[1]} </Typography>

      <Slider
        getAriaLabel={() => 'Range Slider'}
        value={value1}
        onChange={handleChange1}
        onChangeCommitted = {handleChangeCommit}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        disableSwap
        min = {minPrice}
        max = {maxPrice}
        />
    </Box>
  );
}