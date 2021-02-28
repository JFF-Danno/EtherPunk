var web3 = new Web3(Web3.givenProvider);
var factoryInstance;
var priceFeedInstance;
var houseAddress;
var houseprivatekey;
var winAmount;
var localAccount;

var stakeFactoryAddress ='0xb5d36420F7c790D5B0f409C0Be95f0a5542417FC';

var cnt1 = 0;
var cnt2 = 0;
var cnt3 = 0;
var cnt4 = 0;
var cnt5 = 0;
var price = 0;
var ping = [ 0,0,0,0,0 ];

function Ping()
{
    
    $.ajax({        url : '/Matic?Action=PingData&Symbol=BTC' ,
                    type : 'GET',
                    dataType : 'json',
                     success : function(data) { ping[0] = data.cnt1;
                                                ping[1] = data.cnt2;
                                                ping[2] = data.cnt3;
                                                ping[3] = data.cnt4;
                                                ping[4] = data.cnt5;
                                                price = data.price;  }
            });

}

function stakestimeout() { setTimeout( async function () { await Ping(); updateStakes(); stakestimeout(); }, 60000 );  }

$(document).ready(function() {
   
   setTimeout(function () { init(); }, 1000 ); 
   setTimeout(function () { stakestimeout(); }, 1000 ); 
     
});

function init()
{
        window.ethereum.enable().then( async function(accounts)
        {
            localAccount = accounts[0];
            factoryInstance = await new web3.eth.Contract( abiFactory, stakeFactoryAddress, {from:accounts[0]} ); 
        } 
        ).then( async function(){ Ping(); } ).then( async function(){  getStakes(); } );
        
}


async function getStakes()
{
    document.getElementById( 'price' ).innerHTML = 'Latest BTC Price : ' + price;
    for ( var i = 0; i < 5; i++ )
    {
        var stakeAddress    = await factoryInstance.methods.getContractAddress( i ).call();
        var stakeInstance   = await new web3.eth.Contract( abiPRStake, stakeAddress, localAccount );
        var stakeName       = web3.utils.hexToAscii( await stakeInstance.methods.getName().call() );
        var holders         = await stakeInstance.methods.getTotalHolders().call();
        var ethprice        = Math.round( ( price / 1200 ) * 100 ) / 100;
        
        var weiValue        = web3.utils.toWei( ethprice + '' );
        var current         = await stakeInstance.methods.isCurrentStake( weiValue ).call();
        var stakeLow        = await stakeInstance.methods.getlowPrice().call();
        var stakeHigh       = await stakeInstance.methods.getHighPrice().call();
        var totalStaked     = await stakeInstance.methods.getMoneyStored().call();
        var myStake         = await stakeInstance.methods.getMyBalance(localAccount).call();
        var prizePool       = await stakeInstance.methods.getTotalPrizePool().call();
        document.getElementById( 'panels' ).innerHTML = document.getElementById( 'panels' ).innerHTML + '<div id="stake' + i + '" class="stakebox" ><h2>' + stakeName + '<h2><h4>Stakers : ' + holders + '</h4><h4 id="curent' + i + '">Reward pings : ----</h4><h4>Total Staked : ' + totalStaked  + ' </h4><h4>My Stake : ' + myStake + '</h4><h4>PrizePool contribution : ' +  prizePool  + '</h4></div>';
    }
  
}

async function updateStakes()
{
        
    var ethprice        = Math.round( ( price / 1200 ) * 100 ) / 100;
    var weiValue        = web3.utils.toWei( ethprice + '' );
        
        
    document.getElementById( 'price' ).innerHTML = 'Latest BTC Price : ' + price;
    
    for ( var i = 0; i < 5; i++ )
    {
        var stakeAddress    = await factoryInstance.methods.getContractAddress( i ).call();
        var stakeInstance   = await new web3.eth.Contract( abiPRStake, stakeAddress, localAccount );
        var ethprice        = Math.round( ( price / 1200 ) * 100 ) / 100;
        var weiValue        = web3.utils.toWei( ethprice + '' );
        var current         = await stakeInstance.methods.isCurrentStake( weiValue ).call();
        var pingstart        = await stakeInstance.methods.getping().call();
        var myStake         = web3.utils.fromWei( await stakeInstance.methods.getMyBalance(localAccount).call() );

        if ( current )
        {
           // alert( 'current ' + i + " : " + ping[i] );
            var rewards =  1000;
            document.getElementById( 'curent' + i ).innerHTML = '<@# PAYOUT Ping - ' +  ping[i] + " : startping " + pingstart  + ' - rewards - ' +  Math.trunc( ( ping[i] - pingstart )  * rewards * myStake ) + '#@>';
            document.getElementById( 'stake' + i ).style.backgroundColor = "grey";
        }
        else
        {
            var rewards = 1000;
            document.getElementById( 'curent' + i ).innerHTML = 'Reward Pings '  +  ping[i] + " : startping " + pingstart  + ' - rewards - ' +  Math.trunc( ( ping[i] - pingstart )  * rewards * myStake );
            document.getElementById( 'stake' + i ).style.backgroundColor = "white";
        }

    }
  
}



async function DisplayBalance(index)
{
    var address = await factoryInstance.methods.getContractAddress( index ).call();
    var stakeInstance = await new web3.eth.Contract( abiPRStake, address, { from:localAccount } );
    var total = web3.utils.fromWei( await stakeInstance.methods.getMoneyStored().call(), "ether" );
    var balance = web3.utils.fromWei( await stakeInstance.methods.getMyBalance(localAccount).call(), "ether" );
    $('#bal' + index ).text( "total : " + total + " my balance : " + balance );
}

async function getprice()
{
     var price = 0;
     window.ethereum.enable().then( async function(accounts)
    {
        priceFeedInstance = await new web3.eth.Contract( abiPriceFeed, APIAddress, {from:accounts[0]} ); 
        price             = await priceFeedInstance.methods.getPrice().call();
       // alert( 'here ' + price );
       
    });
    
}

function tick()
{
    oldBalance = $( '#startprice' ).val(); 

        DisplayPrice();
}

async function initPriceFeed()
{
    var price = 0;
     window.ethereum.enable().then( async function(accounts)
    {
        priceFeedInstance = await new web3.eth.Contract( abiPriceFeed, APIAddress, {from:accounts[0]} ); 
        price                = await priceFeedInstance.methods.requestBTCPrice().send();
       
    });
}

async function AddToStake( index  )
{
    
    var config = { value: web3.utils.toWei("20000000000000000", "wei" ) };
   
    var address = await factoryInstance.methods.getContractAddress( index ).call();
    alert( 'add to stake address '  + address ); 
    var stakeInstance = await new web3.eth.Contract( abiPRStake, address, { from:localAccount } );
    alert( 'ping ' + ping[index] );
    stakeInstance.methods.addMoney( ping[index] ).send(config)
    .on("transactionHash",function(hash){
            alert( 'tx ' + hash );
            console.log(hash);
        })
     .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);
            // alert( 'confrmed' );
         })
     .on("receipt", function(receipt){
            console.log(receipt);
           // alert( 'recept' );
           document.getElementById( 'panels' ).innerHTML = '';
           
           getStakes();
         });

}

async function RemoveStake( index )
{
    var address = await factoryInstance.methods.getContractAddress( index ).call();
    var stakeInstance = await new web3.eth.Contract( abiPRStake, address, { from:localAccount } );
    var removed = await stakeInstance.methods.removeMoney( ping[index] ).send().on("transactionHash",function(hash){
            console.log(hash);
            alert( 'tx for withdrawal sent' + hash  );
        })
     .on("confirmation", function(confirmationNr){
            console.log(confirmationNr);

         })
     .on("receipt", function(receipt){
            console.log(receipt);
           document.getElementById( 'panels' ).innerHTML = '';
           getStakes();
         });

}





