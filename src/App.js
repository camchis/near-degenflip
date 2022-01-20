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
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div id="coin" class={result}>
          <div class="side-a"><img style={{height: '250px', width: '250px'}} src={heads}/></div>
          <div class="side-b"><img style={{height: '250px', width: '250px'}} src={tails}/></div>
        </div>
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
        <h2>
          Balance: {parseFloat(balance).toFixed(3)}{' NEAR'}
        </h2>
        {showResult && (
          <>
          {/* <h3 style={{color: (winOrLose == 'Won') ? 'green' : 'red'}}>
            {'Last Result: ' }
            {result}
          </h3> */}
          <SpinAnimation/>
          <h3>
            {winOrLose}{' '}{utils.format.formatNearAmount(balanceChange)}{' NEAR'}
          </h3>
          <h2 className='playbutton' onClick={playAgain}>Flip again!</h2>
          </>
        )}

        {showGame && (
          <>

          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            <ChoiceSelection passChoice={setChoice} style={{display: 'flex', marginBottom: '50px'}}/>
            <AmountSelection passAmount={setBetAmount} style={{display: 'flex', flexDirection: 'row'}}/>
          </div>

        
            {choice && betAmount && (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '10px'}}>
                <p>
                  {'Betting on ' }{(choice == '0') ? 'Heads' : 'Tails'}{' for '}{betAmount}{' NEAR'}
                </p>
                {/* <Button colorScheme="yellow" variant="solid" onClick={ async () => { await playGame() }}>
                  Play!
                </Button> */}
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
