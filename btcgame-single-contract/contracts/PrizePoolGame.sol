pragma solidity >=0.4.22 <0.8.0;

contract PrizePoolGame {
   
    address owner;
    bytes32 name;
    uint256 startTime;
    uint256 endTime;
    
    mapping(address => uint) public stakesize;
    mapping(address => uint) public timeChosen;
    mapping(uint => uint256) public priceRangesMap;
    address[] holders;
    address[] payouts;
    
    uint[] timeRangesCovered;
    address prizePoolAddress;
    uint256 prizePool = 0;

    mapping(address => uint) public pingStart;
    mapping(address => uint) public balances;
    mapping(address => uint) public stakeindexes;
    mapping(uint => uint256) public stakeTotal;

    
    constructor(uint256[] memory priceRanges) public {

        owner       = msg.sender;
        for (uint i = 0; i < 5; i++ )        
        {
            priceRangesMap[i] = priceRanges[i];
        }
     }

    
    uint256 moneyStored = 0;
    
    function addMoney( uint panelindex, uint _pingStart ) payable public 
    {
        balances[msg.sender] += 1 ether;
        stakeindexes[msg.sender] = panelindex;
        stakeTotal[panelindex] += 1 ether;
        moneyStored += 1 ether;
        pingStart[msg.sender] = _pingStart;

    }

    function payOut( uint index ) payable public 
    {       

    }
  
    function hasStaker( uint256 minute ) public view returns (bool)
    {
        if ( timeRangesCovered[minute] > 0 )
        {
                return true;
        }
        return false;
    }

    function isMyStake( uint256 panelindex ) public view returns (bool)
    {

      if ( stakeindexes[msg.sender] == panelindex )
      {
          return true;
      }
      return false;
    }     


    function getName() public view returns (bytes32){
        return name;
    }

    function getMyBalance() public view  returns (uint){
        return balances[msg.sender];
    }

    function getTotalStaked( uint index ) public view  returns (uint){
     
        return stakeTotal[index];
    }

    function getTotalPrizePool() public view  returns (uint){
        return prizePool;
    }

    function isCurrentStake(uint256 price, uint stakeindex) public view returns (bool){
        if ( price < priceRangesMap[stakeindex] )
        {
            if ( stakeindex > 0 )
            {
                return price > priceRangesMap[stakeindex-1];
            }
            return true;
        }
        return false;
    }

    function getping() public view returns(uint){
        return pingStart[msg.sender];
    }

}



