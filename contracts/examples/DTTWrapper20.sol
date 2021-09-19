//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol';
import '../DTT.sol';

// This contract can wrap another ERC20 and
// turn it into a DTT. This is very useful for
// "upgrading" existing basic ERC20 tokens
contract DTTWrapper20 is ERC20, ERC20Wrapper, DTT {
  constructor(
    string memory name,
    string memory symbol,
    address underlyingTokenAddress
  ) ERC20(name, symbol) ERC20Wrapper(IERC20(underlyingTokenAddress)) {}
}
