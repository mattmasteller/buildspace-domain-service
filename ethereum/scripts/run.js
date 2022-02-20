const main = async () => {
  // The first person is the deployer, the second is a random account
  const [owner, randomPerson] = await hre.ethers.getSigners()

  const contractFactory = await hre.ethers.getContractFactory('Domains')
  const contract = await contractFactory.deploy()
  await contract.deployed()
  console.log('Contract deployed to:', contract.address)
  console.log('Contract deployed by:', owner.address)

  let txn = await contract.register('doom')
  await txn.wait()

  const domainOwner = await contract.getAddress('doom')
  console.log('Owner of domain:', domainOwner)

  // Trying to set a record that doesn't belong to me!
  txn = await contract
    .connect(randomPerson)
    .setRecord('doom', 'Ha! my domain now!')
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
