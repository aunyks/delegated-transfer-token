const { expect } = require('chai')
const { ethers } = require('hardhat')

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

describe('Delegated Transfer Token - Basic ERC20', () => {
  let dttBasic20Contract = null
  let deployerAccount = null
  let receiverAccount = null
  let delegateAccount = null

  beforeEach(async () => {
    ;[deployerAccount, receiverAccount, delegateAccount] =
      await ethers.getSigners()
    const DTTBasic20 = await ethers.getContractFactory('DTTBasic20')
    dttBasic20Contract = await DTTBasic20.deploy('DTT Basic ERC20', 'DBE')
    await dttBasic20Contract.deployed()
  })

  it('correctly transfers tokens during delegated transfers', async () => {
    const amount = 5
    const fee = 2
    const nonce = 0
    // Current hardhat test chain id
    const chainId = 31337

    // The equivalent of keccak256(abi.encodePacked())
    const hashedTightPacked = ethers.utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
      [
        deployerAccount.address,
        receiverAccount.address,
        amount,
        fee,
        dttBasic20Contract.address,
        nonce,
        chainId,
      ]
    )
    // Sign the message and get the 65 byte signature back
    const signature = await deployerAccount.signMessage(
      ethers.utils.arrayify(hashedTightPacked)
    )

    // Have the delegate account call the delegatedTransfer function
    await dttBasic20Contract
      .connect(delegateAccount)
      .delegatedTransfer(
        deployerAccount.address,
        receiverAccount.address,
        amount,
        fee,
        dttBasic20Contract.address,
        nonce,
        chainId,
        ethers.utils.arrayify(signature)
      )
    const deployerBalancePostTransfer = await dttBasic20Contract.balanceOf(
      deployerAccount.address
    )
    expect(deployerBalancePostTransfer).to.equal(
      193,
      'Post-transfer deployer balance incorrect'
    )
    const receiverBalancePostTransfer = await dttBasic20Contract.balanceOf(
      receiverAccount.address
    )
    expect(receiverBalancePostTransfer).to.equal(
      5,
      'Post-transfer receiver balance incorrect'
    )
    const delegateBalancePostTransfer = await dttBasic20Contract.balanceOf(
      delegateAccount.address
    )
    expect(delegateBalancePostTransfer).to.equal(
      2,
      'Post-transfer delegate balance incorrect'
    )
  })

  it('detects the DTT interface ID', async () => {
    const interfaceId = '0x429b90b8'

    // Have the delegate account call the delegatedTransfer function
    const dttInterfaceMatched = await dttBasic20Contract.hasDTTInterface(
      ethers.utils.arrayify(interfaceId)
    )
    expect(dttInterfaceMatched).to.equal(
      true,
      'Incorrect DTT interface provided'
    )
  })

  it('reverts when an incorrect chain ID is used', async () => {
    const amount = 5
    const fee = 2
    const nonce = 0
    const chainId = 0

    const hashedTightPacked = ethers.utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
      [
        deployerAccount.address,
        receiverAccount.address,
        amount,
        fee,
        dttBasic20Contract.address,
        nonce,
        chainId,
      ]
    )

    const signature = await deployerAccount.signMessage(
      ethers.utils.arrayify(hashedTightPacked)
    )

    await expect(
      dttBasic20Contract
        .connect(delegateAccount)
        .delegatedTransfer(
          deployerAccount.address,
          receiverAccount.address,
          amount,
          fee,
          dttBasic20Contract.address,
          nonce,
          chainId,
          ethers.utils.arrayify(signature)
        )
    ).to.be.revertedWith('DTT: Incorrect chain ID provided')
  })

  it('reverts when an incorrect nonce is used', async () => {
    const amount = 5
    const fee = 2
    const nonce = 2
    const chainId = 31337

    const hashedTightPacked = ethers.utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
      [
        deployerAccount.address,
        receiverAccount.address,
        amount,
        fee,
        dttBasic20Contract.address,
        nonce,
        chainId,
      ]
    )

    const signature = await deployerAccount.signMessage(
      ethers.utils.arrayify(hashedTightPacked)
    )

    await expect(
      dttBasic20Contract
        .connect(delegateAccount)
        .delegatedTransfer(
          deployerAccount.address,
          receiverAccount.address,
          amount,
          fee,
          dttBasic20Contract.address,
          nonce,
          chainId,
          ethers.utils.arrayify(signature)
        )
    ).to.be.revertedWith('DTT: Incorrect nonce provided')
  })

  it("reverts when the signature doesn't verify against the provided parameters", async () => {
    const amount = 5
    const fee = 2
    const incorrectFee = 0
    const nonce = 0
    const chainId = 31337

    const hashedTightPacked = ethers.utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
      [
        deployerAccount.address,
        receiverAccount.address,
        amount,
        fee,
        dttBasic20Contract.address,
        nonce,
        chainId,
      ]
    )

    const signature = await deployerAccount.signMessage(
      ethers.utils.arrayify(hashedTightPacked)
    )

    await expect(
      dttBasic20Contract
        .connect(delegateAccount)
        .delegatedTransfer(
          deployerAccount.address,
          receiverAccount.address,
          amount,
          incorrectFee,
          dttBasic20Contract.address,
          nonce,
          chainId,
          ethers.utils.arrayify(signature)
        )
    ).to.be.revertedWith('DTT: Signature invalid')
  })

  it('reverts when the incorrect token address is provided as an argument', async () => {
    const amount = 5
    const fee = 2
    const nonce = 0
    // Current hardhat test chain id
    const chainId = 31337

    // The equivalent of keccak256(abi.encodePacked())
    const hashedTightPacked = ethers.utils.solidityKeccak256(
      ['address', 'address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
      [
        deployerAccount.address,
        receiverAccount.address,
        amount,
        fee,
        ZERO_ADDRESS,
        nonce,
        chainId,
      ]
    )
    // Sign the message and get the 65 byte signature back
    const signature = await deployerAccount.signMessage(
      ethers.utils.arrayify(hashedTightPacked)
    )

    // Have the delegate account call the delegatedTransfer function
    await expect(dttBasic20Contract
      .connect(delegateAccount)
      .delegatedTransfer(
        deployerAccount.address,
        receiverAccount.address,
        amount,
        fee,
        ZERO_ADDRESS,
        nonce,
        chainId,
        ethers.utils.arrayify(signature)
      )).to.be.revertedWith('DTT: Incorrect token address provided')
  })

  context('when combatting replay attacks', async () => {
    it('reverts when a signature with the same nonce is reused', async () => {
      const amount = 5
      const fee = 2
      const nonce = 0
      const chainId = 31337

      const hashedTightPacked = ethers.utils.solidityKeccak256(
        ['address', 'address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
        [
          deployerAccount.address,
          receiverAccount.address,
          amount,
          fee,
          dttBasic20Contract.address,
          nonce,
          chainId,
        ]
      )

      const signature = await deployerAccount.signMessage(
        ethers.utils.arrayify(hashedTightPacked)
      )

      await dttBasic20Contract
        .connect(delegateAccount)
        .delegatedTransfer(
          deployerAccount.address,
          receiverAccount.address,
          amount,
          fee,
          dttBasic20Contract.address,
          nonce,
          chainId,
          ethers.utils.arrayify(signature)
        )

      // Try a simple replay
      await expect(
        dttBasic20Contract
          .connect(delegateAccount)
          .delegatedTransfer(
            deployerAccount.address,
            receiverAccount.address,
            amount,
            fee,
            dttBasic20Contract.address,
            nonce,
            chainId,
            ethers.utils.arrayify(signature)
          )
      ).to.be.revertedWith('DTT: Incorrect nonce provided')
      // Try using the correct nonce without getting a new signature
      await expect(
        dttBasic20Contract
          .connect(delegateAccount)
          .delegatedTransfer(
            deployerAccount.address,
            receiverAccount.address,
            amount,
            fee,
            dttBasic20Contract.address,
            nonce + 1,
            chainId,
            ethers.utils.arrayify(signature)
          )
      ).to.be.revertedWith('DTT: Signature invalid')
    })

    // NOTE: At the time of this writing, I (@aunyks) don't know of a way to change the chain ID
    //       while Hardhat tests are executing, but because of the require statement
    //       asserting that the provided chain ID matches that of the blockchain, I'm
    //       willing to assume that it functions as intended

    //       If you cannot also make this assumption, do NOT use these contracts.
  })
})
