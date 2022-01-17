import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'
import { providers, utils } from 'near-api-js'
import twitter from "./assets/twitter.png";

//import getConfig from './config'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';

const provider = new providers.JsonRpcProvider(
  "https://archival-rpc.testnet.near.org"
);

export default function App() {

  const [choice, setChoice] = React.useState('0')
  const [betAmount, setBetAmount] = React.useState('0.1')

  const [result, setResult] = React.useState()
  const [showResult, setShowResult] = React.useState(false)
  const [winOrLose, setWinOrLose] = React.useState()
  const [balanceChange, setBalanceChange] = React.useState()

  const [balance, setBalance] = React.useState()

  async function getBalance(accountId) {
    const account = await window.near.account(accountId)
    const balance = await account.getAccountBalance()
    const availableBal = balance.available
    const readableBal = utils.format.formatNearAmount(availableBal)
    return readableBal
  }

  async function playGame() {
    const parsedChoice = parseInt(choice);

    await contract.instant_play(
      {
        choice: parsedChoice,
      },
      2500000000000,
      utils.format.parseNearAmount(betAmount),
    );
  }

  async function getTransactionState(txHash, accountId) {
    const result = await provider.txStatus(txHash, accountId);
    return result.receipts_outcome[0].outcome.logs;
  }

  React.useEffect(
    () => {
      if (window.walletConnection.isSignedIn()) {
        getBalance(window.accountId)
          .then(bal => {
            setBalance(bal)
          })
      }
      const returnUrl = window.location.search;
      if (returnUrl) {
        const urlParams = new URLSearchParams(returnUrl);
        const txid = urlParams.get('transactionHashes');
        if (txid) {
          getTransactionState(txid, window.accountId)
            .then(txResult => {
              setResult(txResult[1])
              setWinOrLose(txResult[2])
              setBalanceChange(txResult[3])
              setShowResult(true)
            })
        }
      }
    },
    []
  )

  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    <>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          {'Hello '}
          {window.accountId}!
        </h1>
        <h2>
          Balance: {parseFloat(balance).toFixed(3)}{' NEAR'}
        </h2>
        {showResult && (
          <>
          <h3 style={{color: (winOrLose == 'Won') ? 'green' : 'red'}}>
            {'Last Result: ' }
            {result}
          </h3>
          <h3>
            {winOrLose}{' '}{utils.format.formatNearAmount(balanceChange)}{' NEAR'}
          </h3>
          </>
        )}

          <FormLabel component="legend">Choice</FormLabel>
          <RadioGroup row aria-label="choice" name="choice" defaultValue="heads" value={choice} onChange={(event) => setChoice(event.target.value)}>
            <FormControlLabel value="0" control={<Radio />} label="Heads" labelPlacement="top"/>
            <FormControlLabel value="1" control={<Radio />} label="Tails" labelPlacement="top"/>
          </RadioGroup>

          <FormLabel component="legend">Bet amount</FormLabel>
          <RadioGroup row aria-label="bet" name="bet" defaultValue="0.1" value={betAmount} onChange={(event) => setBetAmount(event.target.value)}>
            <FormControlLabel value="0.1" control={<Radio />} label="0.1" labelPlacement="top"/>
            <FormControlLabel value="0.25" control={<Radio />} label="0.25" labelPlacement="top"/>
            <FormControlLabel value="0.5" control={<Radio />} label="0.5" labelPlacement="top"/>
            <FormControlLabel value="1" control={<Radio />} label="1" labelPlacement="top"/>
            <FormControlLabel value="2.5" control={<Radio />} label="2.5" labelPlacement="top"/>
            <FormControlLabel value="5" control={<Radio />} label="5" labelPlacement="top"/>
          </RadioGroup>

        <div style={{display: 'flex', marginTop: '20px', marginBottom: '50px'}}>
          <Button variant="contained" disableElevation onClick={ async () => { await playGame() }}>
            Play!
          </Button>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <a href="https://twitter.com/camchis_">
            <img src={twitter}/>
          </a>
        </div>
      </main>
    </>
  )
}
