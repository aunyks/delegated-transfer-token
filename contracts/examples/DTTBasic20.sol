//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '../DTT.sol';

// This contract is used in unit tests
// See tests/dtt.test.js
contract DTTBasic20 is ERC20, DTT {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _mint(_msgSender(), 200);
  }
}
