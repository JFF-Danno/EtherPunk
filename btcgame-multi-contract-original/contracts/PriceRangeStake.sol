pragma solidity >=0.4.22 <0.8.0;

contract PriceRangeStake {
   
    address owner;
    bytes32 name;
    uint256 lowPrice;
    uint256 highPrice;
    mapping(address => uint) public balances;
    mapping(address => uint) public stakesize;
  
    constructor( bytes32 _name, uint256 _lowPrice, uint256 _highPrice ) public {

        name        = _name;
        lowPrice    = _lowPrice;
        highPrice   = _highPrice;
    }

    uint256 prizePool = 0;
    uint256 moneyStored = 0;
    uint    holders = 0;
    uint    pingcnt = 0;    

    function addMoney(uint _pingcnt) payable public 
    {
        if ( balances[msg.sender] < 1 )
        {
            holders++;
        }
        pingcnt = _pingcnt;
        stakesize[msg.sender] += 1;
        balances[msg.sender] += 18000000000000000;
        moneyStored += 20000000000000000;
        prizePool   += 2000000000000000;
    }

    function removeMoney( uint pings ) payable public
    {
        uint rewards = stakesize[msg.sender] * pings * 1000;
        prizePool    -= rewards; 
        uint toPay   = ( stakesize[msg.sender] * 18000000000000000 ) + rewards;
        moneyStored -= ( stakesize[msg.sender] * 18000000000000000 );
        stakesize[msg.sender]   = 0;
        balances[msg.sender]    = 0;
        holders--;
        msg.sender.transfer(toPay);
    }

    function getping() public view returns (uint256){
        return pingcnt;
    }


    function getMoneyStored() public view returns (uint256){
        return moneyStored;
    }

    function getName() public view returns (bytes32){
        return name;
    }

    function getMyBalance(address myAddress) public view  returns (uint){
        return balances[myAddress];
    }

    function getTotalHolders() public view  returns (uint){
     
        return holders;
    }

    function getTotalPrizePool() public view  returns (uint){
     
        return prizePool;
    }

    function isCurrentStake(uint256 price) public view returns (bool){
        if ( price > lowPrice && price <= highPrice )        
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function getlowPrice() public view returns (uint256){
        return lowPrice;
    }

    function getHighPrice() public view returns (uint256){
        return highPrice;
    }
}
