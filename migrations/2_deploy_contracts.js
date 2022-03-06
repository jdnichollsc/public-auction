const contractToDeploy = artifacts.require("./Auction.sol")

module.exports = function(deployer) {
    deployer.deploy(contractToDeploy, 0);
};

