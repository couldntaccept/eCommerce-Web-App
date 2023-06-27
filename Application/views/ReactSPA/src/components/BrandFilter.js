import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';

export default function BrandFilter(props) {

  const [InputValue, setInputValue] = useState('')
  const [BrandDropdown, setBrandDropdown] = useState([])


  useEffect(() => {
    //Clear the dropdown value when the component renders
    props.setDropdownFilter([])
  }, [InputValue])


  useEffect(() => {
    //Get the narrowed list of brands from the searched data
    const BrandList = props.SearchedPhoneData.map(item => item.brand).filter((value, index, self) => self.indexOf(value) === index)

    //Define the whole set of brands
    const Brands = [
      { brand: 'Samsung' },
      { brand: 'Apple' },
      { brand: 'Nokia' },
      { brand: 'Huawei' },
      { brand: 'LG' },
      { brand: 'Motorola' },
      { brand: 'HTC' },
      { brand: 'Sony' }
    ]

    //If the searched brand finds a match with a brand on the list, then add it onto BrandArray.
    //Once loop is complete, set the BrandDropdown state to BrandArray. This will update the dropdown on the screen.
    const BrandArray = [];
    for (let i = 0; i < Brands.length; i++) {

      for (let j = 0; j < BrandList.length; j++) {
        if (Brands[i].brand == BrandList[j]) {
          BrandArray.push(Brands[i])
        }
      }
    }
    setBrandDropdown(BrandArray);
  }, props.SearchedPhoneData)

  const handleChange = (event, value, reason) => {
    //onInputChange updates the value to "" instead of an empty array so a condition is required here.
    if (value != "") {
      const brands = value.map(x => x.brand)
      //setBrandDropdownFilter(brands)
      props.setDropdownFilter(brands)
    } else {
      props.setDropdownFilter([])
    }
  }


  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      options={BrandDropdown}
      getOptionLabel={(option) => option.brand}
      /*defaultValue={[Brands[0]]}*/

      filterSelectedOptions
      onChange={handleChange}
      onInputChange={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Filter Brand(s)"
          placeholder="Brand"
        />
      )}
    />

  );
}