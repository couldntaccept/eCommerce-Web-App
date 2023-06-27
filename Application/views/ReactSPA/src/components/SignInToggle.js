import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


export default function SignInToggle(props) {
  const [alignment, setAlignment] = React.useState(props.startAlignment);

  const handleChange = (event, value) => {
    if (value !== null) {
      window.history.replaceState({}, value, "/" + value)
      setAlignment(value);
      props.onToggle(value);
    }

  };


  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}

    >
      <ToggleButton value="SignIn">Sign In</ToggleButton>
      <ToggleButton value="SignUp">Sign Up</ToggleButton>
    </ToggleButtonGroup>
  );
}