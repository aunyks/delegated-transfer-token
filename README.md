# Delegated Transfer Token

You're a generous person, and sometimes you want to send tokens to others. On Ethereum, you need Ether _and_ the token just to send the token. Needing two currencies just to send one sucks. _Delegated transfer tokens_ make it better.

With _delegated transfer tokens_, you can send a token using _just that token_. No need to have Ether in your wallet just to send money.

## What is it, _really_?

DTTs are a new token pattern inspired by the [ERC-865](https://github.com/ethereum/EIPs/issues/865) token standard. It maintains the standard's motivation of allowing users to pay transaction fees in the desired token, but it resolves the security concerns that the standard had (namely replay attacks).

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
