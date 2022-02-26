import { networks } from './networks'

const handleChainChanged = () => window.location.reload()

export const checkIfWalletIsConnected = async (
  setCurrentAccount,
  setNetwork
) => {
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

  // Check user's network chain ID
  const chainId = await ethereum.request({ method: 'eth_chainId' })
  setNetwork(networks[chainId])

  ethereum.on('chainChanged', handleChainChanged)
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

export const switchNetwork = async () => {
  if (window.ethereum) {
    try {
      // Try to switch to the Mumbai testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
      })
    } catch (error) {
      // This error code means that the chain we want has not been added to MetaMask
      // In this case we ask the user to add it to their MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Polygon Mumbai Testnet',
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                nativeCurrency: {
                  name: 'Mumbai Matic',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  } else {
    // If window.ethereum is not found then MetaMask is not installed
    alert(
      'MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html'
    )
  }
}
