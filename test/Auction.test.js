const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const auction_json = require('./../build/contracts/Auction.json');

let accounts;
let auction;
let owner;
let startingPriceEth = 10;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    owner = accounts[0];
    auction = await new web3.eth.Contract(auction_json['abi'])
        .deploy({
            data: auction_json['bytecode'],
            arguments: [web3.utils.toWei(startingPriceEth.toString(), 'ether')]
        })
        .send({
            from: owner,
            gas: '999999'
        });
});

describe('Auction', () => {
    it('stores lastest bid', async () => {
        const expectedBid = startingPriceEth + 5;

        await auction.methods.bid().send({
            from: accounts[2],
            value: web3.utils.toWei(expectedBid.toString(), 'ether')
        });
        bid = await auction.methods.latestBid().call();
        assert.equal(bid, web3.utils.toWei(expectedBid.toString(), 'ether'), "Invalid lastest bid.");
    });

    it('stores lastest bidder', async () => {
        const expectedBidder = accounts[2];

        await auction.methods.bid().send({
            from: expectedBidder,
            value: web3.utils.toWei((startingPriceEth + 5).toString(), 'ether')
        });
        bidder = await auction.methods.latestBidder().call();
        assert.equal(bidder, expectedBidder, "Invalid lastest bidder.");
    });
    
    it('should give back previous bid', async () => {
        const bidder = accounts[2];
        const startingBalance = Number(await web3.eth.getBalance(bidder));
        
        await auction.methods.bid().send({
            from: bidder,
            value: web3.utils.toWei((startingPriceEth + 5).toString(), 'ether')
        });
        
        balanceAfterBid = Number(await web3.eth.getBalance(bidder));
        
        await auction.methods.bid().send({
            from: accounts[3],
            value: web3.utils.toWei((startingPriceEth + 6).toString(), 'ether')
        });
        
        balance = Number(await web3.eth.getBalance(bidder));
        assert(balance > balanceAfterBid && balanceAfterBid < startingBalance, "previous bid was not returned to bidder.");
    });
    
    it('should transfer fund to seller', async () => {
        const startingBalance = Number(await web3.eth.getBalance(owner));
        
        await auction.methods.bid().send({
            from: accounts[2],
            value: web3.utils.toWei((startingPriceEth + 5).toString(), 'ether')
        });
        
        await auction.methods.finishAuction().send({
            from: owner
        });
        
        balance = Number(await web3.eth.getBalance(owner));
        assert(balance > startingBalance, "Seller did not receive funds after auction end.");
    });

    it('should not allow to bid lower', async () => {
        const bidder = accounts[2];

        try {
            await auction.methods.bid().send({
                from: bidder,
                value: web3.utils.toWei((startingPriceEth - 5).toString(), 'ether')
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
    
    it('should not allow to bid after auction end', async () => {
        await auction.methods.bid().send({
            from: bidder,
            value: web3.utils.toWei((startingPriceEth + 5).toString(), 'ether')
        });
        
        await auction.methods.finishAuction().send({
            from: owner
        });
        
        try {
            await auction.methods.bid().send({
                from: bidder,
                value: web3.utils.toWei((startingPriceEth + 6).toString(), 'ether')
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
});
