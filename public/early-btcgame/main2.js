var web3 = new Web3(Web3.givenProvider);
var factoryInstance;
var priceFeedInstance;
var houseAddress;
var houseprivatekey;
var winAmount;
var localAccount;

var factoryAddress ='0x408C19B56c177dA6c4582A1C689BC11eBc486a63';

var priceFeedAddress ='0x2899e65d43552B2054d7902C8201b1683F5936de';

$(document).ready(function() {

    init();
    $( '#get' ).click(function(){ tick });
});

function tick()
{
    oldBalance = $( '#startprice' ).val(); 
    

//      get price
//      add a ping cnt to current stake in payoutPings
//      use ping data to get report data    
        DisplayPrice();
}


function init()
{
        window.ethereum.enable().then( async function(accounts)
        {
            localAccount = accounts[0];
            priceFeedInstance = await new web3.eth.Contract( abiPriceFeed, priceFeedAddress, {from:accounts[0]} ); 
            factoryInstance = await new web3.eth.Contract( abiFactory, factoryAddress, {from:accounts[0]} ); 
            var bal = '0';
            $('#startprice' ).val( bal );
            for ( var i = 0; i < 3; i++ )
            {
                var stakeAddress    = await factoryInstance.methods.getContractAddress( i ).call();
                var stakeInstance   = await new web3.eth.Contract( abiPRStake, stakeAddress, {from:accounts[0]} );
                var stakeName       = await stakeInstance.methods.getName().call();
                var stakeLow        = await stakeInstance.methods.getlowPrice().call();
                var stakeHigh       = await stakeInstance.methods.getHighPrice().call();
                var holders         = await stakeInstance.methods.getTotalHolders().call();
                var current         = await stakeInstance.methods.isCurrentStake( bal ).call();
                var totalStaked     = await stakeInstance.methods.getMoneyStored().call();
                var myStake         = await stakeInstance.methods.getMyBalance(localAccount).call();
                var prizePool       = await stakeInstance.methods.getTotalPrizePool().call();

                $('#root').append( '<p><a href="#" onclick="AddToStake(' + i + ')" >Add to ' + web3.utils.hexToAscii(stakeName) + '</a> - <a href="#" onclick="WithdrawStake(' + i + ')" >Withdraw  '  + web3.utils.hexToAscii(stakeName) + '</a> low : ' + stakeLow + ' : high ' + stakeHigh + ' : balance <span id="bal' + i + '" >.....</span><span> holders : ' + holders + ' : total staked : ' + totalStaked + '</span> current : ' + current + ' my stake : ' + myStake + ' prize pool : ' + prizePool + '</p>' );
                await DisplayBalance(i);
            }
        } )
       .then( async function() {     });
}

async function updateStakes(bal)
{
    for ( var i = 0; i < 3; i++ )
    {
        var stakeAddress    = await factoryInstance.methods.getContractAddress( i ).call();
        var stakeInstance   = await new web3.eth.Contract( abiPRStake, stakeAddress, { from:localAccount } );
        var stakeName       = await stakeInstance.methods.getName().call();
        var stakeLow        = await stakeInstance.methods.getlowPrice().call();
        var stakeHigh       = await stakeInstance.methods.getHighPrice().call();
        var holders         = await stakeInstance.methods.getTotalHolders().call();
        var totalStaked     = await stakeInstance.methods.getMoneyStored().call();
        var myStake         = await stakeInstance.methods.getMyBalance(localAccount).call();
        var prizePool       = await stakeInstance.methods.getTotalPrizePool().call();
        var current         = await stakeInstance.methods.isCurrentStake( web3.utils.toWei( bal ) ).call();

        $('#root').append( '<p><a href="#" onclick="AddToStake(' + i + ')" >Add to ' + web3.utils.hexToAscii(stakeName) + '</a> - <a href="#" onclick="WithdrawStake(' + i + ')" >Withdraw  '  + web3.utils.hexToAscii(stakeName) + '</a> low : ' + stakeLow + ' : high ' + stakeHigh + ' : balance <span id="bal' + i + '" >.....</span><span> holders : ' + holders + ' : total staked : ' + totalStaked + '</span> current : ' + current + ' my stake : ' + myStake + ' prize pool : ' + prizePool + '</p>' );
        await DisplayBalance(i);
    }
}


var oldBalance = 0;
async function DisplayPrice()
{
    var bal = web3.utils.fromWei( await priceFeedInstance.methods.getPrice( oldBalance, Math.floor(Math.random() * 100 ) ).call(), "ether" );
    $('#price' ).text( bal + ' : ' + ( bal * 1200 ) );
    $('#startprice' ).val( web3.utils.toWei( bal ) );
    oldBalance = bal;updateStakes(bal);
}

async function DisplayBalance(index)
{
    var address = await factoryInstance.methods.getContractAddress( index ).call();
    var stakeInstance = await new web3.eth.Contract( abiPRStake, address, { from:localAccount } );
    var total = web3.utils.fromWei( await stakeInstance.methods.getMoneyStored().call(), "ether" );
    var balance = web3.utils.fromWei( await stakeInstance.methods.getMyBalance(localAccount).call(), "ether" );
    $('#bal' + index ).text( "total : " + total + " my balance : " + balance );
}

async function AddToStake( index )
{

    
    return faucetContract.methods.fund(account.address).send({ ...hmy.gasOptions(), from: account.address })
  
    var config = {
        value: web3.utils.toWei( "10", "ether")
    };
   
    var address = await factoryInstance.methods.getContractAddress( index ).call();
    var stakeInstance = await new web3.eth.Contract( abiPRStake, address, { from:localAccount } );
    
    stakeInstance.methods.addMoney().send(config)
    .on("transactionHash",function(hash){
            console.log(hash);
        })
     .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);

         })
     .on("receipt", function(receipt){
            console.log(receipt);
           
         });

}

async function WithdrawStake( index )
{
    var address = await factoryInstance.methods.getContractAddress( index ).call();
    var stakeInstance = await new web3.eth.Contract( abiPRStake, address, { from:localAccount } );
    var removed = await stakeInstance.methods.removeMoney( 4 ).send().on("transactionHash",function(hash){
            console.log(hash);
            alert( 'tx for withdrawal sent' + hash  );
        })
     .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);

         })
     .on("receipt", function(receipt){
            console.log(receipt);
           
         });

   // alert( 'withdrawal sent ' + removed );

}





