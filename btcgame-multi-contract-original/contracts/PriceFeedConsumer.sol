// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.4.22 <0.8.1;

//import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";

contract PriceFeedConsumer is ChainlinkClient {
  
    uint256 public price;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    
    /**
     * Network: Matic Mumbai Testnet
     * Oracle: 0xBf87377162512f8098f78f055DFD2aDAc34cbB47
     * Job ID: 6b57e3fe0d904ba48d137b39350c7892
     * LINK address: 0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB
     * Fee: 0.01 LINK
     */
    constructor() public {
        setChainlinkToken(0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB);
        oracle = 0xBf87377162512f8098f78f055DFD2aDAc34cbB47;
        jobId = "6b57e3fe0d904ba48d137b39350c7892";
        fee = 10 ** 16; // 0.01 LINK
    }
    
    function requestPrice() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=QD6H4HU4EBGQUA9P");
        string[] memory path = new string[](2);
        path[0] = "Realtime Currency Exchange Rate";
        path[1] = "5. Exchange Rate";
        request.addStringArray("path", path);
        request.addInt("times", 10000000000);
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId)
    {
        price = _price;
    }
}


