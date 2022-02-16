// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const {interface, bytecode} = require('./compile')

const provider = new HDWalletProvider(
    'exclude home rich treat topic power loan health wood when one youth',
    'https://rinkeby.infura.io/v3/dae6113a31c4415f9db7ac3615fb4908'
)

const web3 = new Web3(provider)

const deploy = async()=>{
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from: ",accounts[0])
     const result = await new web3.eth.Contract(JSON.parse(interface))
     .deploy( {data:bytecode} )
     .send({gas:1000000, from:accounts[0]});

     console.log("interface: ", interface)
     console.log("Contract deployed: ", result.options.address)

   // provider.engine.stop();
};

deploy();