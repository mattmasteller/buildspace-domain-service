// yarn hardhat node
// yarn hardhat run ethereum/scripts/deploy.js --network mumbai|localhost

const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory('Domains')
  const contract = await contractFactory.deploy('guitar')
  await contract.deployed()

  console.log('Contract deployed to:', contract.address)

  let txn = await contract.register('strat', {
    value: hre.ethers.utils.parseEther('0.1'),
  })
  await txn.wait()
  console.log('Minted domain strat.guitar')

  txn = await contract.setRecord('strat', 'Am I a strat or a guitar??')
  await txn.wait()
  console.log('Set record for strat.guitar')

  const address = await contract.getAddress('strat')
  console.log('Owner of domain "strat":', address)

  const balance = await hre.ethers.provider.getBalance(contract.address)
  console.log('Contract balance:', hre.ethers.utils.formatEther(balance))
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()
