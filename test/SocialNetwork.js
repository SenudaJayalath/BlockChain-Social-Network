const { assert } = require('chai')


const SocialNetwork = artifacts.require('SocialNetwork.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
    let socialNetwork
    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })
    describe('deployment', async () => {
        it('deploys successfully', async () => {

            let address = await socialNetwork.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async () => {
            const name = await socialNetwork.name()
            assert.equal(name, "Dapp Uniersity Social Network")
        })
    })
    describe('posts', async () => {
        let result, postCount
        before(async () => {
            result = await socialNetwork.createPost('This is my first post', { from: author })
            postCount = await socialNetwork.postCount()
        })
        it('creats posts', async () => {
            
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber())
            assert.equal(event.content, 'This is my first post')
            assert.equal(event.tipAmount, '0')
            assert.equal(event.author, author)

            //Failures
            await socialNetwork.createPost('', { from: author }).should.be.rejected;
        })
        it('lists posts', async () => {
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber())
            assert.equal(post.content, 'This is my first post')
            assert.equal(post.tipAmount, '0')
            assert.equal(post.author, author)
        })
        it('allows users to tip posts', async () => {
             let oldAuthorBalance
             oldAuthorBalance = await web3.eth.getBalance(author)
             oldAuthorBalance = new web3.utils.BN(author)

            result = await socialNetwork.tipPost(postCount,{from: tipper,value:web3.utils.toWei('1','Ether') })
            //Success
            const event = result.logs[0].args
            
            assert.equal(event.id.toNumber(), postCount.toNumber())
            assert.equal(event.content, 'This is my first post')
            assert.equal(event.tipAmount, '1000000000000000000')
            assert.equal(event.author, author)   

            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(author)

            let tipAmount
            tipAmount =web3.utils.toWei('1', 'Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            const expectedBalance = oldAuthorBalance.add(tipAmount)
            // console.log(oldAuthorBalance.toString())
            // console.log(newAuthorBalance.toString())
            // console.log( expectedBalance.toString())
            //assert.equal(newAuthorBalance.toString(), expectedBalance.toString()) 


            //Failures
            //Tips a non existing post
            await socialNetwork.tipPost(99,{from:tipper,value:web3.utils.toWei('1','Ether')}).should.be.rejected


        })
    })
})