var web3 = new Web3(Web3.givenProvider);
var factoryInstance;
var priceFeedInstance;
var houseAddress;
var houseprivatekey;
var winAmount;
var localAccount;
var feedPrice;

var priceFeedAddress = '0x65E1Cf92117A1449731Be09d890A68Fe5F4a27A6';
var stakeFactoryAddress ='0xb5d36420F7c790D5B0f409C0Be95f0a5542417FC';

var cnt1 = 0;
var cnt2 = 0;
var cnt3 = 0;
var cnt4 = 0;
var cnt5 = 0;
var price = 0;
var ping = [ 0,0,0,0,0 ];

async function PingWeb()
{
    Ping(0);
}

async function PingLink()
{
    Ping(1);
}

async function PingManual()
{
    Ping(2);
}

async function Ping(priceIndex)
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
    $('#ping').text( 'Ping $ ' + price );

    feedPrice =  await priceFeedInstance.methods.price().call();
    feedPrice = ( feedPrice / 10000000000 );

    getStakes(priceIndex);
    
}

function stakestimeout() { setTimeout( async function () { await Ping(); updateStakes(); stakestimeout(); }, 600000 );  }

$(document).ready(function() {
   
   setTimeout(function () { init(); }, 1000 ); 
 //  setTimeout(function () { stakestimeout(); }, 1000 ); 
     
});

function init()
{
    for ( var i = 1; i < 6; i++ )
    {
        $('#stakers' + i ).text( 'This Game' );
        $('#stakers2' + i ).text( 'This Game' );
        $('#staked' + i ).text( 'Only Works' );
        $('#staked2' + i ).text( 'Only Works' );
        $('#mystake' + i ).text( 'On Matic\'s Mumbai Test Net' );
        $('#mystake2' + i ).text( 'On Matic\'s Mumbai Test Net' );
        $('#rewards' + i ).text( 'Setup Info above ^^^' );
        $('#rewards2' + i ).text( 'Setup Info above ^^^' );
    }
        window.ethereum.enable().then( async function(accounts)
        {
            localAccount = accounts[0];
            factoryInstance = await new web3.eth.Contract( abiFactory, stakeFactoryAddress, {from:accounts[0]} );
            priceFeedInstance = await new web3.eth.Contract( abiPriceFeed, priceFeedAddress, {from:accounts[0]} );
        } 
        ).then( async function(){ Ping(); } ).then( async function(){  getStakes(); } );
        
}

var bgcnt = 1;
var colours = [ "#121212","#44444", "#232323", "#555555","#323232", "#434343","#474747" ,"#777777" ];
async function getStakes(priceIndex)
{
    
    $('#linkping2').text( 'Ping $' + feedPrice );

    var priceToUse = 0;
    if ( priceIndex == 0 )
    {
        priceToUse = price;
    }
    else if ( priceIndex == 1 )
    {
        priceToUse = feedPrice;
    }
    else
    {
        priceToUse = $('#manualprice').val();
    }
    
    var mumbai_or_bust    = await factoryInstance.methods.getContractAddress( 0 ).call();
    for ( var i = 1; i < 6; i++ )
    {
        $('#stakers' + i ).text( 'Updating' );
        $('#stakers2' + i ).text( 'Updating' );
        $('#staked' + i ).text( 'Updating' );
        $('#staked2' + i ).text( 'Updating' );
        $('#mystake' + i ).text( 'Updating' );
        $('#mystake2' + i ).text( 'Updating' );
        $('#rewards' + i ).text( 'Updating' );
        $('#rewards2' + i ).text( 'Updating' );
    }
   // alert('price' + priceToUse );
    for ( var i = 0; i < 5; i++ )
    {
        
        var stakeAddress    = await factoryInstance.methods.getContractAddress( i ).call();
        var stakeInstance   = await new web3.eth.Contract( abiPRStake, stakeAddress, localAccount );
        var stakeName       = web3.utils.hexToAscii( await stakeInstance.methods.getName().call() );
        var holders         = await stakeInstance.methods.getTotalHolders().call();
        var ethprice        = Math.round( ( priceToUse / 1200 ) * 100 ) / 100;
        
        var weiValue        = web3.utils.toWei( ethprice + '' );
        var current         = await stakeInstance.methods.isCurrentStake( weiValue ).call();
        var stakeLow        = await stakeInstance.methods.getlowPrice().call();
        var stakeHigh       = await stakeInstance.methods.getHighPrice().call();
        var totalStaked     = await stakeInstance.methods.getMoneyStored().call();
        var myStake         = await stakeInstance.methods.getMyBalance(localAccount).call();
        var prizePool       = await stakeInstance.methods.getTotalPrizePool().call();
        var pingstart        = await stakeInstance.methods.getping().call();

        var panelindex = i + 1;
        if ( current )
        {
            $('#panel' + panelindex ).css( 'background-image',  'url(\'panel' + bgcnt + '.jpg\')' );
            $('#panel' + panelindex ).css( 'background-color',  'powderblue' );
        }
        else
        {
            $('#panel' + panelindex ).css( 'background-image',  'none' );
            $('#panel' + panelindex ).css( 'background-color',  colours[bgcnt-1] );
        }
        
       // $('#panel' + panelindex ).css( 'background-color',  'grey' );
        $('#stakers' + panelindex ).text( 'Stake Holders. ' + holders );
        $('#stakers2' + panelindex ).text( 'Stake Holders. ' + holders );
        $('#staked' + panelindex ).text( 'Total Staked. ' + web3.utils.fromWei( totalStaked ) );
        $('#staked2' + panelindex ).text( 'Total Staked. ' + web3.utils.fromWei( totalStaked ) );
        $('#mystake' + panelindex ).text( 'My Stake. ' + web3.utils.fromWei( myStake ) );
        $('#mystake2' + panelindex ).text( 'My Stake. ' + web3.utils.fromWei( myStake ) );

        var rewards =  0.001 + '';
        
        if ( pingstart > 0 && myStake > 0 && pingstart < ping[i] )
        {
            var myrewards = ( rewards * myStake ) + '';
            var payout = ( Math.trunc( ( ping[i] - pingstart )  *  myrewards ) ) + '';
            
           // alert( 'payout ' + payout ); 
            $('#rewards' + panelindex ).text( 'Rewards ' + web3.utils.fromWei( payout ) );
            $('#rewards2' + panelindex ).text( 'Rewards ' + web3.utils.fromWei( payout ) );
        }
        else
        {
            $('#rewards' + panelindex ).text( 'Rewards. 0' );
            $('#rewards2' + panelindex ).text( 'Rewards. 0' );
        }
   

    }
    if ( bgcnt > 11 )
    {
        bgcnt = 1;
    }
    else
    {
        bgcnt++;
    }
    
  
}

async function updateStakes()
{
        
    var ethprice        = Math.round( ( price / 1200 ) * 100 ) / 100;
    var weiValue        = web3.utils.toWei( ethprice + '' );
        
        
    document.getElementById( 'price' ).innerHTML = 'Latest BTC Price : ' + price + ' Link Oracle Price ' + feedPrice;
    
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


async function LinkRequest()
{
   var response    = await priceFeedInstance.methods.requestPrice().send();
   // pingOracle();  This version can stay on the old ping
}

async function pingOracle()
{ 
    var priceFeedInstance = await new web3.eth.Contract( abiPriceFeed, priceFeedAddress, { from:localAccount } );
    const tx = {  gas: 210000, from: localAccount, to: '0x65E1Cf92117A1449731Be09d890A68Fe5F4a27A6', data: priceFeedInstance.methods.requestPrice().encodeABI(), value: 0 };
    const signPromise = web3.eth.accounts.signTransaction( tx,'0x711a5c2ec738d2087b416f8b131415b80dbef8011454216e6137940236904849');

       signPromise.then((signedTx) => {  

       const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  
      
      sentTx.on("receipt", receipt => {
             alert( 'receipt' );
      });
      sentTx.on("error", err => {
        
        alert( 'tx error' + err );

      });
      
    }).catch((err) => {
      
        alert( 'error' );
      // do something when promise fails
      
    });

}




