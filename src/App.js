import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'
import { providers, utils } from 'near-api-js'
import twitter from "./assets/twitter.png";
import heads from "./assets/heads.png";
import tails from "./assets/tails.png";

// import { Button } from '@chakra-ui/react'

import ChoiceSelection from './components/ChoiceSelection'
import AmountSelection from './components/AmountSelection'

const provider = new providers.JsonRpcProvider(
  "https://archival-rpc.testnet.near.org"
);

export default function App() {

  const [showGame, setShowGame] = React.useState(true)


  const [choice, setChoice] = React.useState('')
  const [betAmount, setBetAmount] = React.useState('')

  const [result, setResult] = React.useState()
  const [resultImg, setResultImg] = React.useState()

  const [showResult, setShowResult] = React.useState(false)
  const [winOrLose, setWinOrLose] = React.useState()
  const [balanceChange, setBalanceChange] = React.useState()

  const [balance, setBalance] = React.useState()

  const [spinning, setShowSpinning] = React.useState()

  async function getBalance(accountId) {
    const account = await window.near.account(accountId)
    const balance = await account.getAccountBalance()
    const availableBal = balance.available
    const readableBal = utils.format.formatNearAmount(availableBal)
    return readableBal
  }

  async function playGame() {
    console.log('play')
    const parsedChoice = parseInt(choice);

    await contract.instant_play(
      {
        choice: parsedChoice,
      },
      2500000000000,
      utils.format.parseNearAmount(betAmount),
    );
  }

  function playAgain() {
    setShowResult(false)
    setShowGame(true)
  }

  async function getTransactionState(txHash, accountId) {
    const result = await provider.txStatus(txHash, accountId);
    return result.receipts_outcome[0].outcome.logs;
  }


  function SpinAnimation() {
    return (
      <div style={{position: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'space-between'}}>
        <div id="coin" class={result}>
          <div class="side-a"><img style={{height: '', width: '300px'}} src={heads}/></div>
          <div class="side-b"><img style={{height: '300px', width: '300px'}} src={tails}/></div>
        </div>
        <h3 id="fadeIn" style={{color: (winOrLose == 'Won') ? '#e69a10' : 'red'}}>
          {winOrLose}{' '}{utils.format.formatNearAmount(balanceChange)}{' NEAR'}
        </h3>
        <h2 id="fadeIn" className='playbutton' onClick={playAgain}>Flip again!</h2>
      </div>
    )
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
              setShowGame(false)
              setShowSpinning(true)
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
        {showResult && (
          <>
            <SpinAnimation/>
          </>
        )}

        {showGame && (
          <>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h1 style={{marginTop: '0.25em', marginBottom: '0px'}}>Apeflip</h1>
              <h2 style={{marginTop: '0.05em', marginBottom: '1em'}}>Double or nothing</h2>
            </div>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            <ChoiceSelection passChoice={setChoice} style={{display: 'flex', marginBottom: '1em'}}/>
            <AmountSelection passAmount={setBetAmount} style={{display: 'flex', flexDirection: 'row'}}/>
          </div>

        
            {choice && betAmount && (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '0.25em'}}>
                <p>
                  {'Betting on ' }{(choice == '0') ? 'Heads' : 'Tails'}{' for '}{betAmount}{' NEAR'}
                </p>
                <h2 className='playbutton' onClick={ async () => { await playGame() }}>Spin!</h2>
              </div>
            )}
          </>
          )}
        {/* <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}>
          <a href="https://twitter.com/camchis_">
            <img src={twitter}/>
          </a>
        </div> */}
      </main>
    </>
  )
}
