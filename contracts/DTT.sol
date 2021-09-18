//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import 'hardhat/console.sol';

abstract contract DTT is ERC20 {
  using ECDSA for bytes32;

  mapping(address => uint256) internal _nonceOf;

  function nonceOf(address account) public view returns (uint256) {
    return _nonceOf[account];
  }

  function delegatedTransfer(
    address sender,
    address recipient,
    uint256 amount,
    uint256 fee,
    uint256 nonce,
    uint256 chainId,
    bytes memory signature
  ) public {
    require(nonce == _nonceOf[sender], 'DTT: Incorrect nonce provided');
    require(chainId == block.chainid, 'DTT: Incorrect chain ID provided');
    require(
      keccak256(
        abi.encodePacked(sender, recipient, amount, fee, nonce, chainId)
      ).toEthSignedMessageHash().recover(signature) == sender,
      'DTT: Signature invalid'
    );
    // Send money to recipient
    _transfer(sender, recipient, amount);
    // Send money to delegate (txion submitter)
    _transfer(sender, _msgSender(), fee);
    _nonceOf[sender] += 1;
  }
}
