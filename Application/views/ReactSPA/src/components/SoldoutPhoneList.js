import * as React from 'react';
import { useState, useEffect,useContext } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import PopupItem from './PopupItem';
import LoginContext from '../store/LoginContext';


export default function Soldout(props) {

  const [data, setData] = useState([]);

  const [hovering, setHovering] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const loginctx = useContext(LoginContext);

  /* Replaced by the props.handleOpen function
  const handleItemClick = (item) => {
    setSelectedItem(item);
    console.log(item)
    setDialogOpen(true);
  };
*/
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const fetchSoldoutPhones = async () => {
    try {
      const response = await fetch("http://oldphonedeals.onrender.com/phones/soldout");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    fetchSoldoutPhones();
  }, [loginctx.cartItems]);

  useEffect(() => {
    fetchSoldoutPhones();
  }, [props.open]);



  return (
    <div>
      <ImageList cols={5} gap={10} sx={{ width: 1300, height: 400, marginLeft: '20px' }}>
        {data.map((item) => (
          <ImageListItem key={item.title}
            onMouseEnter={() => setHovering(item)}
            onMouseLeave={() => setHovering(null)}
            onClick={() => props.handleOpen(item)}

            style={{
              borderRadius: '10px',
              boxShadow: hovering === item ? '0px 0px 10px #aaa' : 'none',
              marginTop: '10px',
              marginBottom: '10px',
              marginLeft: '10px',
              marginRight: '10px',
              transition: 'box-shadow 0.2s ease-in-out'
            }}

            className={hovering === item ? 'hover-effect' : ''}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img
                src={item.image}
                srcSet={item.image}
                style={{
                  width: '80%',
                  height: 'auto',
                  marginBottom: '10px'
                }}
                alt={item.title}
                loading="lazy"
              />

              <div style={{
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>{item.title.length > 50 ? item.title.slice(0, 40) + '...' : item.title}</div>

              <div style={{
                textAlign: 'center',
                fontSize: '14px',
                color: '#777'
              }}>Stock: {item.stock} Left. </div>

              <div style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>${item.price.toFixed(2)}</div>
            </div>


          </ImageListItem>
        ))}
      </ImageList>

      <PopupItem
        item={selectedItem}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />

    </div>
  );
}