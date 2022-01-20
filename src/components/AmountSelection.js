import React from 'react';
import pointone from "../assets/01near.png";
import pointtwofive from "../assets/025near.png";
import one from "../assets/1near.png";
import twopointfive from "../assets/25near.png";
import five from "../assets/5near.png";


//This is so DUMB i need to fix this shit lmfaoooooo
export default function AmountSelection(props) {
  const [selected, setSelected] = React.useState('');

  const handleSelection = (value) => {
    setSelected(value)
    props.passAmount(value)
  }

  return (
    <div style={props.style}>
        <div class='bet' value='0.1' style={{margin: '25px', opacity: selected=='0.1' ? '0.5' : null}} onClick={() => handleSelection('0.1')}>
          <img style={{height: '75px', width: '75px'}} src={pointone}/>
        </div>
        <div class='bet' value='0.25' style={{margin: '25px', opacity: selected=='0.25' ? '0.5' : null}} onClick={() => handleSelection('0.25')}>
          <img style={{height: '75px', width: '75px'}} src={pointtwofive}/>
        </div>
        <div class='bet' value='1' style={{margin: '25px', opacity: selected=='1' ? '0.5' : null}} onClick={() => handleSelection('1')}>
          <img style={{height: '75px', width: '75px'}} src={one}/>
        </div>
        <div class='bet' value='2.5' style={{margin: '25px', opacity: selected=='2.5' ? '0.5' : null}} onClick={() => handleSelection('2.5')}>
          <img style={{height: '75px', width: '75px'}} src={twopointfive}/>
        </div>
        <div class='bet' value='5' style={{margin: '25px', opacity: selected=='5' ? '0.5' : null}} onClick={() => handleSelection('5')}>
          <img style={{height: '75px', width: '75px'}} src={five}/>
        </div>
    </div>
  )
}