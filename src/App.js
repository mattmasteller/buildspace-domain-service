import React, { useEffect, useState } from 'react'
import './styles/App.css'
import twitterLogo from './assets/twitter-logo.svg'
import { ethers } from 'ethers'

import { checkIfWalletIsConnected, connectWallet } from './utils/web3'

import domainContract from './utils/contract.json'

// Constants
const TWITTER_HANDLE = '_buildspace'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

// Add the domain you will be minting
const tld = '.guitar'

const App = () => {
  // State variable we use to store our user's public wallet.
  const [currentAccount, setCurrentAccount] = useState('')
  const [domain, setDomain] = useState('')
  const [record, setRecord] = useState('')

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) {
      return
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert('Domain must be at least 3 characters long')
      return
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price =
      domain.length === 3 ? '0.5' : domain.length === 4 ? '0.3' : '0.1'
    console.log('Minting domain', domain, 'with price', price)
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS,
          domainContract.abi,
          signer
        )

        console.log('Going to pop wallet now to pay gas...')
        let tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price),
        })
        // Wait for the transaction to be mined
        const receipt = await tx.wait()

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log(
            'Domain minted! https://mumbai.polygonscan.com/tx/' + tx.hash
          )

          // Set the record for the domain
          tx = contract.setRecord(domain, record)
          await tx.wait()

          console.log(
            'Record set! https://mumbai.polygonscan.com/tx/' + tx.hash
          )

          setRecord('')
          setDomain('')
        } else {
          alert('Transaction failed! Please try again')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

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

  // Form to enter domain name and data
  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="tld"> {tld} </p>
        </div>

        <input
          type="text"
          value={record}
          placeholder="what's your favorite guitar?"
          onChange={(e) => setRecord(e.target.value)}
        />

        <div className="button-container">
          <button
            className="cta-button mint-button"
            disabled={null}
            onClick={mintDomain}
          >
            Mint
          </button>
          <button
            className="cta-button mint-button"
            disabled={null}
            onClick={null}
          >
            Set data
          </button>
        </div>
      </div>
    )
  }

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

        {/* Hide the connect button if currentAccount isn't empty */}
        {!currentAccount && <RenderNotConnectedContainer />}
        {/* Render the input form if an account is connected */}
        {currentAccount && renderInputForm()}

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
