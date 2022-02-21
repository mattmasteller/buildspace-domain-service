const main = async () => {
  // The first person is the deployer, the second is a random account
  const [owner, randomPerson] = await hre.ethers.getSigners()

  const contractFactory = await hre.ethers.getContractFactory('Domains')
  const contract = await contractFactory.deploy('guitar')
  await contract.deployed()
  console.log('Contract deployed to:', contract.address)
  console.log('Contract deployed by:', owner.address)

  let txn = await contract.register('strat', {
    value: hre.ethers.utils.parseEther('0.1'),
  })
  await txn.wait()

  const domainOwner = await contract.getAddress('strat')
  console.log('Owner of domain "strat":', domainOwner)

  // Trying to set a record that doesn't belong to me!
  // txn = await contract
  //   .connect(randomPerson)
  //   .setRecord('doom', 'Ha! my domain now!')

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
