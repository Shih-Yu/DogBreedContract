//importing Truffle contract artifact
let BN = web3.utils.BN
let Dogbreed = artifacts.require('DogBreedContract');
let catchRevert = require("./exceptionsHelpers.js").catchRevert

//defining contract block
contract('DogBreedContract', function(accounts) {

    const verifier = accounts[0]
    const ben = accounts[1]
    const charlie = accounts[2]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    const price = "1000"
    const excessAmount = "2000"
    const name = "Spot"
    const breed = "Hunter"
    const groomingcost = "100"
    const age = "1"
    const certified = "true"

    let instance

    beforeEach(async () => {
        instance = await Dogbreed.new()
    })
 
//test if dogs are added with provided arguments 
it("should add dog to list with provided name, breed, groomingcost, age, price and certified", async () => {
    const tx = await instance.addDog(name, breed, groomingcost, age, price, certified, {from: ben})
                
        const result = await instance.getDog.call(1)

        assert.equal(result[0], name, 'the name of the last added dog does not match the expected value')
        assert.equal(result[1], breed, 'the breed of the last added dog does not match the expected value')
        assert.equal(result[2].toString(10), groomingcost, 'the groomingcost of the last added dog does not match the expected value')
        assert.equal(result[3].toString(10), age, 'the age of the last added dog does not match the expected value')
        assert.equal(result[5].toString(10), price, 'the price of the last added dog does not match the expected value')
        assert.equal(result[6].toString(10), certified, 'the certified state of the dog for sale should be true ')
        assert.equal(result[8], ben, 'the address adding the dog should be listed as the seller')//make it seller not verifier
        assert.equal(result[9], emptyAddress, 'the buyer address should be set to 0 when a dog is added')
})

//test only certified dogs can be for sale
it("should only sell certified dogs", async () => {
const tx = await instance.addDog(name, breed, groomingcost, age, price, certified, {from: ben})
                
        const result = await instance.getDog.call(1)
        assert.equal(result[6].toString(10), certified, 'the certified state of the dog for sale should be true ')
})



//test for transaction of buying a dog 
it("should allow someone to purchase a dog and update state accordingly", async() => {

        await instance.addDog(name, breed, groomingcost, age, price, certified, {from: ben})
        var benBalanceBefore = await web3.eth.getBalance(ben)
        var charlieBalanceBefore = await web3.eth.getBalance(charlie)

        await instance.buyDog(1, {from: charlie, value: excessAmount})

        var benBalanceAfter = await web3.eth.getBalance(ben)
        var charlieBalanceAfter = await web3.eth.getBalance(charlie)

        const result = await instance.getDog.call(1)

        assert.equal(result[7].toString(10), 1, 'the state of the dog should be "Sold", which should be declared second in the State Enum')
        assert.equal(result[9], charlie, 'the buyer address should be set charlie when he purchasing a dog')
        assert.equal(new BN(benBalanceAfter).toString(), new BN(benBalanceBefore).add(new BN(price)).toString(), "ben's balance should be increased by the price of the dog")
        assert.isBelow(Number(charlieBalanceAfter), Number(new BN(charlieBalanceBefore).sub(new BN(price))), "charlie's balance should be reduced by more than the price of the dog (including gas costs)")
    })

//test buyer's account has to have sufficient amount in order to buy
it("should error when not enough value is sent to purchase dog", async ()=> {
    await instance.addDog(name, breed, groomingcost, age, price, certified, {from: ben})
    await catchRevert(instance.buyDog(1, {from: charlie, value: 1}))
})

//test if dog is marked bought
it("should emit BoughtDog when dog is bought", async () => {
    var eventEmitted = false

       await instance.addDog(name, breed, groomingcost, age, price, certified, {from: ben})
       const tx = await instance.buyDog(1, {from: charlie, value: excessAmount})

       if (tx.logs[0].event == "BoughtDog") {
           eventEmitted = true
       }
         assert.equal(eventEmitted, true, 'adding a should emit a BoughtDog event')
})

//test only bought dogs can be called in received function
it("should only mark received if dog has been bought", async () => {
    var eventEmitted = false

        await instance.addDog(name, breed, groomingcost, age, price, certified, {from: ben})
        const tx = await instance.buyDog(1, {from: charlie, value: excessAmount})

        if (tx.logs[0].event == "BoughtDog") {
            eventEmitted = true
        }
            assert.equal(eventEmitted, true, 'buying a dog should emit a Received event')
})

//test only the buyer can call received function
it("should revert when address other than the buyer marks receivedDog", async () => {
    await instance.addDog(name, breed, groomingcost, age, price, certified, {from: ben})
    await instance.buyDog(1, {from: charlie, value: excessAmount})
    await catchRevert(instance.receivedDog(1, {from: ben}))
})

});