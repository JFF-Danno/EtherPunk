pragma solidity >=0.4.22 <0.8.0;

import "./PriceRangeStake.sol";
import "./PrizePool.sol";

contract SilverStakeFactory {

    constructor() public {
        createContracts();
    }

    address[] Contracts;

    function createContract (bytes32 name, uint256 low, uint256 high) private {
        address newContract = address( new PriceRangeStake(name,low,high) );
        Contracts.push(newContract);
    }

    function createContracts() private 
    { 
        createContract (    " < $25"          ,    0                      , 20833333000000000 );
        createContract (    "$25 - $30"       ,    20833333000000001      , 25000000000000000 );
        createContract (    "$30 - $40"      ,    25000000000000001      , 33333333000000000 );

        createContract (    "$40 - $50"     ,    33333333000000001      , 41666667000000000 );
        createContract (    "$50 >"          ,    41666667000000001     , 65500000000000000000 );
    }

    function getContractAddress(uint cnt) public view returns (address)
    {
        address out = Contracts[cnt];
        return out;
    }   
   
}



