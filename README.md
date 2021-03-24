# ETHA Subgraph

[ETHA](https://etherscan.io/address/0x59e9261255644c411afdd00bd89162d09d862e38#code) is an ERC-20 token, that will give its holder on-chain voting rights for protocol parameters, amendments, upgrades, as well as granting them at a later stage shares of the protocol fees. Furthermore, it can be used to mine additional tokens by providing liquidity..

This subgraph dynamically tracks all balances and transactions, and historical data of ETHA token holders.

- data of balances of ETHA holders,
- data of transactions
- data of historical transactions

## Setup

### Prerequisites

First, ensure these are installed:

- [Truffle](https://www.trufflesuite.com/truffle)
- [Graph-CLI](https://www.npmjs.com/package/@graphprotocol/graph-cli)

### Installation

- Clone repository and go to root directory.

1. `yarn`
2. `yarn codegen`
3. `yarn build`
4. `yarn deploy:mainnet`

## Queries

Below are a few ways to show how to query the ETHA-subgraph for data. The queries show most of the information that is queryable, but there are many other filtering options that can be used, just check out the [querying api](https://thegraph.com/docs/graphql-api). These queries can be used locally or in The Graph Explorer playground.

## Key Entity Overviews

#### Account

Contains data of token holders.

#### Transaction

Every transaction of ETHA token.

## Example Queries

### Querying first 5 token holders

This query fetches account data token holders, it includes address, balance and history.

```graphql
{
  accounts(first: 5) {
    id
    address
    balance
    history {
      id
    }
  }
}
```
