const PrizePoolGame = artifacts.require("PrizePoolGame");

module.exports = function (deployer) {
       
    var ranges = [ 40000, 45000, 50000, 55000, 1000000 ];
    deployer.deploy( PrizePoolGame, ranges );
    
};
