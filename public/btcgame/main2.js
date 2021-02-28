var web3 = new Web3(Web3.givenProvider);
var prizePoolInstance;
var priceFeedInstance;
var houseAddress;
var houseprivatekey;
var winAmount;
var localAccount;
var feedPrice;

var priceFeedAddress = '0x65E1Cf92117A1449731Be09d890A68Fe5F4a27A6';
//var PrizePoolAddress ='0xCD70501bE4f4B99a1aec5330a1D481768fc79480';
var PrizePoolAddress ='0x64e56E62E52BDbfc471b4F39F1209fA58AAD5c85';
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
    

    feedPrice =  await priceFeedInstance.methods.price().call();
    feedPrice = ( feedPrice / 10000000000 );
    $('#ping').text( 'Ping $ ' + price );
    getStakes(priceIndex);
    
}

function stakestimeout() { setTimeout( async function () { await Ping(0); updateStakes(); stakestimeout(); }, 600000 );  }

$(document).ready(function() {
   
   setTimeout(function () { init(); }, 1000 ); 
 //  setTimeout(function () { stakestimeout(); }, 1000 ); 
     
});

function init()
{
        window.ethereum.enable().then( async function(accounts)
        {
            localAccount = accounts[0];
            prizePoolInstance = await new web3.eth.Contract( abiPrizePool, PrizePoolAddress, {from:accounts[0]} );
            priceFeedInstance = await new web3.eth.Contract( abiPriceFeed, priceFeedAddress, {from:accounts[0]} );
        } 
        ).then( async function(){ Ping(0); } );
        
}

var bgcnt = 1;
var colours = [ "#121212","#44444", "#232323", "#555555","#323232", "#434343","#474747" ,"#777777" ];
async function getStakes(priceIndex)
{
   //alert( 'getstakes ' + priceIndex );
    
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
    
    for ( var i = 1; i < 6; i++ )
    {
    //    $('#stakers' + i ).text( 'Updating' );
    //    $('#stakers2' + i ).text( 'Updating' );
        $('#staked' + i ).text( 'Updating' );
        $('#staked2' + i ).text( 'Updating' );
        $('#mystake' + i ).text( 'Updating' );
        $('#mystake2' + i ).text( 'Updating' );
        $('#rewards' + i ).text( 'Updating' );
        $('#rewards2' + i ).text( 'Updating' );
    }

    for ( var i = 0; i < 6; i++ )
    {
    //    var holders         = await prizePoolInstance.methods.getTotalHolders( i ).call();
        var current         = await prizePoolInstance.methods.isCurrentStake( Math.round( priceToUse ), i ).call();
        var mytotalStaked   = await prizePoolInstance.methods.getMyBalance().call();
        var totalStaked     = await prizePoolInstance.methods.getTotalStaked( i + 1 ).call();
        var isMyStake       = await prizePoolInstance.methods.isMyStake( i + 1 ).call();
        var rewards         =  0.0001;            
       // var prizePool       = await stakeInstance.methods.getTotalPrizePool().call();
        var pingstart        = 0;
        var panelindex = i + 1;
        if ( isMyStake )
        {
            pingstart =   await prizePoolInstance.methods.getping().call();                                             
            $('#mystake' + panelindex ).text( 'My Stake. ' + web3.utils.fromWei( mytotalStaked ) );
            $('#mystake2' + panelindex ).text( 'My Stake. ' + web3.utils.fromWei( mytotalStaked ) );
            
            var panelpings =   ping[i];
            var payouttest = panelpings - pingstart;
            if ( pingstart > 0 )
            {
                var myrewards = ( rewards * mytotalStaked ) + '';
               var payout = ( ( panelpings - pingstart )  *  myrewards ) + '';
            
               // alert( 'payout ' + payout ); 
                $('#rewards' + panelindex ).text( 'Rewards ' + web3.utils.fromWei( payout ) );
                $('#rewards2' + panelindex ).text( 'Rewards ' + web3.utils.fromWei( payout ) );
            }
            else
            {
                $('#rewards' + panelindex ).html( 'Rewards 0' );
                $('#rewards2' + panelindex ).html( 'Rewards 0' );
            }
           
        }
        else
        {
            $('#rewards' + panelindex ).text( 'Pings ' + ping[i] );
            $('#rewards2' + panelindex ).text( 'Pings ' + ping[i] );
            $('#mystake' + panelindex ).html( '&nbsp;' );
            $('#mystake2' + panelindex ).html( '&nbsp;' );
        }

        
        if ( current )
        {
            $('#panel' + panelindex ).css( 'background-image',  'url(\'panel' + bgcnt + '.png\')' );
            $('#panel' + panelindex ).css( 'background-color',  colours[bgcnt-1] );
        }
        else
        {
            $('#panel' + panelindex ).css( 'background-image',  'none' );
            $('#panel' + panelindex ).css( 'background-color',  colours[bgcnt-1] );
        }

        $('#staked' + panelindex ).text( 'Total Staked. ' + web3.utils.fromWei( totalStaked ) );
        $('#staked2' + panelindex ).text( 'Total Staked. ' + web3.utils.fromWei( totalStaked ) );

        
        
       
        
  // alert( 'uh i ' + i + ' ps:' + pingstart + ' is mine?' + isMyStake + ' pings' + ping[i] );

    }
    if ( bgcnt > 6 )
    {
        bgcnt = 1;
    }
    else
    {
        bgcnt++;
    }
    
  
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
   // alert( 'add ' + index + ' start ' + ping[index] );
    
    var config = { value: web3.utils.toWei("20000000000000000", "wei" ) };

    prizePoolInstance.methods.addMoney( index + 1, ping[index] ).send(config)
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




