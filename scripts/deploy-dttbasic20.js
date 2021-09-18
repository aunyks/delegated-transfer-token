// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface
  // If using `node`, run the below
  // await hre.run('compile')

  // We get the contract to deploy
  const DTTBasic20 = await hre.ethers.getContractFactory('DTTBasic20')
  const dttBasic20Contract = await DTTBasic20.deploy('DTT Basic ERC20', 'DBE')

  await dttBasic20Contract.deployed()

  console.log('DTTBasic20 deployed to:', dttBasic20Contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
