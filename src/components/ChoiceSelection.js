import React from 'react';
import heads from "../assets/heads.png";
import tails from "../assets/tails.png";


//This is so DUMB i need to fix this shit lmfaoooooo
export default function ChoiceSelection(props) {
  const [selected, setSelected] = React.useState('');

  const handleSelection = (value) => {
    setSelected(value)
    props.passChoice(value)
  }


  return (
    <div style={props.style}>
      {selected == '0' ? (
        <>
          <div class='bet' value='Heads' style={{textAlign: 'center', opacity: '0.5', marginRight: '2em'}} onClick={() => handleSelection('0')}>
            <img style={{height: '15em', width: '15em'}} src={heads}/>
          </div>
          <div class='bet' value='Heads' style={{textAlign: 'center'}} onClick={() => handleSelection('1')}>
            <img style={{height: '15em', width: '15em'}} src={tails}/>
          </div>
        </>
      ):
      selected == '1' ? (
        <>
          <div class='bet' value='Heads' style={{textAlign: 'center', marginRight: '2em'}} onClick={() => handleSelection('0')}>
            <img style={{height: '15em', width: '15em'}} src={heads}/>
          </div>
          <div class='bet' value='Tails' style={{textAlign: 'center', opacity: '0.5'}} onClick={() => handleSelection('1')}>
            <img style={{height: '15em', width: '15em'}} src={tails}/>
          </div>
        </>
      ):
      <>
        <div class='bet' value='Heads' style={{textAlign: 'center', marginRight: '2em'}} onClick={() => handleSelection('0')}>
          <img style={{height: '15em', width: '15em'}} src={heads}/>
        </div>
        <div class='bet' value='Tails' style={{textAlign: 'center'}} onClick={() => handleSelection('1')}>
          <img style={{height: '15em', width: '15em'}} src={tails}/>
        </div>
      </>
      }
    </div>
  )
}