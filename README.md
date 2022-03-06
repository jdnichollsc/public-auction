## Introduction

Your task is to implement a basic `Auction` using a smart contract which grants its creator the ability to initiate and manage a public auction.

## Contract interface description

1. `Auction` constructor:
* should set `seller` field to contract creator,
* should set `latestBid` field to the `startingPrice` (in Wei).

2. Payable `bid` function:
* is used to place a new bid,
* should `revert` if auction is already finished,
* should return previous bid to the bidder.

3. `finishAuction` function:
* is used to manually finish the auction,
* should `revert` if auction is already finished,
* should withdraw winning bid to the seller,
* should be callable only by the auction owner.

You should not change public contract interfaces, i.e. `seller`, `latestBid`, `latestBidder` fields and `bid`, `finishAuction` methods should remain accessible by external components and tests.
