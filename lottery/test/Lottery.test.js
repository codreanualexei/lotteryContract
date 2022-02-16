// contract test code will go here
const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const {interface,bytecode} = require('../compile')
const web3 = new Web3(ganache.provider())

let accounts;
let lottery;  //Contract name

beforeEach(async ()=>{

    accounts = await web3.eth.getAccounts()
    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: '1000000'})
    //console.log("Contract deployed: ",inbox)
})

describe('Inbox',()=>{

    it('Deployed contract',()=>{
        assert.ok(lottery.options.address)
    });

    it('Multiple new players ', async()=>{

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        })

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        })

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')
        })

        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.02','ether')
        })

        
        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0],players[0])
        assert.equal(accounts[1],players[1])
        assert.equal(accounts[2],players[2])
        assert.equal(accounts[3],players[3])
        assert.equal(4,players.length)
    });


    it('Minimum value for enter', async()=>{
        
        try{
            await lottery.methods.enter().send({
                from: accounts[3],
                value: web3.utils.toWei('0.02','ether')
            })

            assert(false)
        }catch(err){
            assert(err)
        }
    });

    it("Only manager has the access to the player list",async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            })
            assert(false)
        }catch(err){
            assert(err)
        }
    })

    it('Pick up winner function',async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        })

        const initialBalance = await web3.eth.getBalance(accounts[0])

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        const finalBalance = await web3.eth.getBalance(accounts[0])

        const difference= finalBalance - initialBalance


        assert.ok(difference > web3.utils.toWei('1.8','ether'))
    })
    
})