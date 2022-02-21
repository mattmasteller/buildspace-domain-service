export const checkIfWalletIsConnected = async (setCurrentAccount) => {
  const { ethereum } = window

  if (!ethereum) {
    console.log('Make sure you have metamask!')
    return
  } else {
    console.log('We have the ethereum object', ethereum)
  }

  // Check if we're authorized to access the user's wallet
  const accounts = await ethereum.request({ method: 'eth_accounts' })

  // Users can have multiple authorized accounts, we grab the first one if its there!
  if (accounts.length !== 0) {
    const account = accounts[0]
    console.log('Found an authorized account:', account)
    setCurrentAccount(account)
  } else {
    console.log('No authorized account found')
  }
}

export const connectWallet = async (setCurrentAccount) => {
  try {
    const { ethereum } = window

    if (!ethereum) {
      alert('Get MetaMask -> https://metamask.io/')
      return
    }

    // Fancy method to request access to account.
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

    // Boom! This should print out public address once we authorize Metamask.
    console.log('Connected', accounts[0])
    setCurrentAccount(accounts[0])
  } catch (error) {
    console.log(error)
  }
}
