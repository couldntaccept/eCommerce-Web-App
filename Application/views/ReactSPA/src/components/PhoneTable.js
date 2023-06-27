import * as React from 'react';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';




export default function PhoneTable(props) {
  //Filter the search results based on the range slider and brand
  let tempFilteredPhoneData = []



  //When the component has rendered, 
  useEffect(() => {

    const minPriceFilter = props.PriceRangeFilter[0]
    const maxPriceFilter = props.PriceRangeFilter[1]

    console.log("Filtering the table..")


    //if the dropdown filter is blank, filter only based on Price
    if (props.DropdownFilter.length === 0) {
      for (let i = 0; i < props.SearchedPhoneData.length; i++) {
        if (props.SearchedPhoneData[i].price >= minPriceFilter
          &&
          props.SearchedPhoneData[i].price <= maxPriceFilter
        ) {
          tempFilteredPhoneData.push(props.SearchedPhoneData[i]);
        }
      }
    }
    else {//else if the brand filter is active, filter on Price AND Brand
      for (let i = 0; i < props.SearchedPhoneData.length; i++) {
        if (props.SearchedPhoneData[i].price >= minPriceFilter
          &&
          props.SearchedPhoneData[i].price <= maxPriceFilter
          &&
          props.DropdownFilter.includes(props.SearchedPhoneData[i].brand)
        ) {
          tempFilteredPhoneData.push(props.SearchedPhoneData[i]);
        }
      }
    }

    props.setFilteredPhoneData(tempFilteredPhoneData)

  },
    //ONLY call this useEffect when the PriceRange and Dropdown changes
    [props.PriceRangeFilter, props.DropdownFilter])



  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead >
          <TableRow>
            <TableCell align="left">View</TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">brand</TableCell>
            <TableCell align="right">image</TableCell>
            <TableCell align="left">stock</TableCell>
            <TableCell align="left">seller</TableCell>
            <TableCell align="left">price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.FilteredPhoneData.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                {/*Opens the Dialog and sets state to "item"*/}
                <Button onClick={() => props.handleOpen(row)}>View</Button>

              </TableCell>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="right">{row.brand}</TableCell>
              <TableCell align="right"><img src={row.image} alt={row.brand} width="50" height="60"></img></TableCell>
              <TableCell align="right">{row.stock}</TableCell>
              <TableCell align="left">{row.sellerfullname}</TableCell>
              <TableCell align="right">${row.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}