//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import 'hardhat/console.sol';

abstract contract DTT is ERC20 {
  using ECDSA for bytes32;

  mapping(address => uint256) internal _nonceOf;

  bytes4 private constant DTT_INTERFACE_ID =
    bytes4(keccak256('nonceOf(address)')) ^
      bytes4(
        keccak256(
          'delegatedTransfer(address,address,uint256,uint256,uint256,uint256,bytes)'
        )
      );

  // Use this function in your `supportsInterface()` function
  function hasDTTInterface(bytes4 interfaceId) public pure returns (bool) {
    return interfaceId == DTT_INTERFACE_ID;
  }

  function nonceOf(address account) public view virtual returns (uint256) {
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
  ) public virtual {
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
