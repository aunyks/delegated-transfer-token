# Delegated Transfer Token

On Ethereum, you need Ether _and_ the token just to send the token. Needing two currencies just to send one sucks. Delegated transfer tokens make it better.

With delegated transfer tokens, you can send a token using _just that token_. No need to have Ether in your wallet just to send money.

## Get started

1. Install the contracts

```
npm install --save delegated-transfer-token
```

2. Import them into your project! I highly recommend using them alongside [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts).

```solidity
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import 'delegated-transfer-token/contracts/DTT.sol';

contract DTTBasic20 is ERC20, DTT {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    // Mint 200 tokens when the contract is deployed
    _mint(_msgSender(), 200 * (10 ** decimals()));
  }
}
```

## How does it work?

The `DTT` contract extends the ERC20 standard to introduce a `delegatedTransfer()` function. It lets users define normal transfer parameters in addition to a nonce, chain ID, signature, and fee designating the number of tokens paid to the transaction delegate. See `contracts/DTT.sol` and related examples for more details.

```solidity
function delegatedTransfer(
  address sender,
  address recipient,
  uint256 amount,
  uint256 fee,
  address tokenAddress,
  uint256 nonce,
  uint256 chainId,
  bytes memory signature
)
```

Let's say Alice wants to pay Charlie in DTT, but she doesn't have any Ether in her wallet. Here's how she can use `delegatedTransfer()` with Bob's help to send money to Charlie.

1. Alice tells Bob she wants to send some DTT to Charlie
2. Bob tells Alice how much DTT he wants in order to submit the transaction
3. Alice agrees on the fee, signs the payload (all the parameters in the `delegatedTransfer` function), and gives the payload and signature to Bob
4. Bob calls `delegatedTransfer()` with the agreed parameters and Alice's signature

DONE! Charlie receives Alice's payment and Bob earns his fees as a delegate once the transaction is confirmed. Here, Bob is the only one that has some Ether.

## What is it, really?

DTTs are a new token pattern inspired by the [ERC-865](https://github.com/ethereum/EIPs/issues/865) token standard. It maintains the standard's motivation of allowing users to pay transaction fees in the desired token, but it resolves the security concerns the standard had (namely replay attacks).

DTTs are also ERC20-compatible, so if you want to do old-style token transfers you can!

## Why this?

One of the worst experiences Ethereum users have is needing Ether and a token to send the token. It's a confusing process that's hindering adoption of cryptocurrencies overall. DTTs provide the refreshing and familiar experience of sending money with just that money alone.

DTTs also provide businesses and individuals new revenue models by enabling a fee market: people can compete to earn fees in the desired token by offering users the best prices and fastest transaction speeds possible.

## But crypto people don't like third parties

"Crypto people" don't like **trusted** third parties. Because a delegate is only relaying a user's signature to the chain, they can't modify it to steal money.

Users only need to trust that delegates will actually submit the transaction, not that they can change its details.

_Be mindful of the license._

### LICENSE

Delegated Transfer Token
Copyright (C) 2021 Gerald Nash

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
