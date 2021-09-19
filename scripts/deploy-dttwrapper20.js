// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

const tokenName = 'DTT Wrapper Token'
const tokenSymbol = 'DBE'
const underlyingTokenSymbol = '0x2125e5963f17643461be3067ba75c62dac9f3d4a'

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface
  // If using `node`, run the below
  // await hre.run('compile')

  // We get the contract to deploy
  const DTTWrapper20 = await hre.ethers.getContractFactory('DTTWrapper20')
  const dttWrapper20Contract = await DTTWrapper20.deploy(
    tokenName,
    tokenSymbol,
    underlyingTokenSymbol
  )

  await dttWrapper20Contract.deployed()

  console.log('DTTWrapper20 deployed to:', dttWrapper20Contract.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
