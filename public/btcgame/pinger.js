var web3 = new Web3(Web3.givenProvider);
var priceFeedAddress = '0x65E1Cf92117A1449731Be09d890A68Fe5F4a27A6';
var nonce = 210;

async function pingOracle()
{ 
    var priceFeedInstance = await new web3.eth.Contract( abiPriceFeed, priceFeedAddress, { from:'0x14f6b02364853C2b3d0570C8dfD8e18867Da1b80' } );
    const tx = {  nonce: nonce++, gasPrice: 300, gas: 210000, from: '0x14f6b02364853C2b3d0570C8dfD8e18867Da1b80', to: '0x65E1Cf92117A1449731Be09d890A68Fe5F4a27A6', data:           priceFeedInstance.methods.requestPrice().encodeABI(), value: 0 };
    const signPromise = web3.eth.accounts.signTransaction( tx,'0x711a5c2ec738d2087b416f8b131415b80dbef8011454216e6137940236904849');

       signPromise.then( async (signedTx)=> 
       {  
            alert( 'tx ' + signedTx.rawTransaction );
          const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);  
      
          sentTx.on("receipt", receipt => {
                                                 alert( 'receipt' + receipt );
                                                $('#nonce').text( 'Nonce ' + nonce );
                                          });

         sentTx.on("error", err => {      alert( 'tx error' + err );   });
      
       }).catch((err) => {  alert( 'error ' +   err ); });

       alert( 'end of story' );
}


function timeout() { setTimeout( async function () { await pingOracle(); timeout() }, 60000 );  }

async function start()
{   
    await init();
    pingOracle();
    timeout();
    $('#nonce').text( 'Nonce ' + nonce );

}

function init()
{
        window.ethereum.enable().then( async function(accounts)
        {
            localAccount = accounts[0];
            priceFeedInstance = await new web3.eth.Contract( abiPriceFeed, priceFeedAddress, {from:'0x14f6b02364853C2b3d0570C8dfD8e18867Da1b80'} );
        } 
        );
        
}
