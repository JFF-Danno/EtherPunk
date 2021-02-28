require('@babel/register');
({
    ignore: /node_modules/
});
require('@babel/polyfill');

const HDWalletProvider = require('@truffle/hdwallet-provider');

let mnemonic = 'install loan off seed drift renew stick hole give problem army general'; 
let testAccounts = [
"0x4a63e8fd61a5ff9a8a410d044c0f363408ca34c9348154716d8b7ca1ddb8fbc5",
"0xe23bf2d73e8017f45a415130cc7c153dc3474a9e9809497a3ca7c24c38e37c34",
"0x566d635be45617e9799d02d6fb6f223307b94f7609a9dc3e1aa8c80f8cddf6f0",
"0x00c9aaf4918a5852186de5681e542e314ea13a0f3a770e9f72989e0f6fd005fc",
"0x3a7ad73111bc21a6e46eb131e3a9595700bc97276de3137a7494fe44728407f2",
"0x414a5d8c1e34f213d24917f678c05c9ba237efc2ddb1b09d97b3a6b6bd7e097a",
"0x217f39ecf23b69a7c4f6f8b6673d7bb8be13a63ea61b8c74cecff4b249842895",
"0x86e041b83684d9b960b726eecd738775ef26b398328602f2f7771645bac83200",
"0x8bca0a18f3123f3053b1bfa9025b98f4172288447c30b50ea755df8eacc0d590",
"0xef077d06b72c4d04b9f4ebb67ba11480142441210867b0f9dfe61d83e2643c63"
]; 
let rpcUri = 'https://rpc-mumbai.matic.today';
let wsUri = 'wss://ws-mumbai.matic.today';

module.exports = {
    testAccounts,
    mnemonic,
    networks: {
        development: {
            uri: rpcUri,
            wsUri: wsUri,
            provider: () => new HDWalletProvider(
                mnemonic,
                rpcUri, // provider url
                0, // address index
                10, // number of addresses
                true, // share nonce
                `m/44'/60'/0'/0/` // wallet HD path
            ),
            gas: 3000000,
            network_id: 80001,
            confirmations: 1,
            timeoutBlocks: 150,
            skipDryRun: true
        }
    },
    compilers: {
        solc: {
            version: '^0.5.11'
        }
    }
};
