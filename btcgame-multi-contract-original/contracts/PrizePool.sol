pragma solidity >=0.4.22 <0.8.0;

contract PrizePool {
    
    uint256 totalPool = 0;

    function addToPool() public payable
    {
        totalPool += msg.value;
    }

    function getPoolTotal() public view returns (uint256){
        return totalPool;
    }

    event PayoutPotCreated( uint payout );
    
     function AddToPot() public payable {

        emit PayoutPotCreated( 1 ether );
    }
}
