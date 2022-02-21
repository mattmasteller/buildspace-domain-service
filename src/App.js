import React, { useEffect, useState } from 'react'
import './styles/App.css'
import twitterLogo from './assets/twitter-logo.svg'

import { checkIfWalletIsConnected, connectWallet } from './utils/web3'

// Constants
const TWITTER_HANDLE = '_buildspace'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const App = () => {
  // State variable we use to store our user's public wallet.
  const [currentAccount, setCurrentAccount] = useState('')

  // This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected(setCurrentAccount)
  }, [])

  const RenderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/8y0sUH2illZcZvXL4N/giphy.gif"
        alt="Guitar gif"
      />
      <button
        onClick={() => connectWallet(setCurrentAccount)}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🎸 Guitar Name Service</p>
              <p className="subtitle">
                Your favorite guitar on the blockchain!
              </p>
            </div>
          </header>
        </div>

        {/* Hide the connect button if currentAccount isn't empty*/}
        {!currentAccount && <RenderNotConnectedContainer />}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
