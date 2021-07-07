import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar';
import SocialNetwork from '../abis/SocialNetwork.json'
import Main from './Main'

class App extends Component {

  constructor(props){
    super(props)
    this.state={
      accounts:'',
      socialNetwork:null,
      postCount:0,
      posts:[],
      loading:true
    }
    this.createPost=this.createPost.bind(this);
    this.tipAmount=this.tipAmount.bind(this);
  }
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockChainData()
  }
  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          //web3.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
      }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      // Acccounts always exposed
      //web3.eth.sendTransaction({/* ... */});
  }
  // Non-dapp browsers...
  else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
  }
  

  async loadBlockChainData(){
    const web3= window.web3
    const accounts =await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({accounts:accounts[0]})

    const networkId =await web3.eth.getId()
    const networkData= SocialNetwork.networks[networkId]
    if (networkData){
      
      const socialNetwork= web3.eth.Contract(SocialNetwork.abi,networkData.address)
     
      this.setState({socialNetwork})
      const postCount =await socialNetwork.methods.postCount().call()
      this.setState({postCount})
      console.log(this.state.socialNetwork)
      for (var i=1; i<=this.state.postCount;i++){
        const post= await socialNetwork.methods.posts(i).call()
        this.setState({
          posts:[...this.state.posts,post]
        })
      }
      this.setState({loading:false})
      
    }else{
      console.log('Not deployed')
    }
  }
  async createPost(e){
    this.setState({loading:true})
    await this.state.socialNetwork.methods.createPost(e).send({from:this.state.accounts })
    this.setState({loading:false})
  }
  async tipAmount(e){
    this.setState({loading:true})
    this.state.socialNetwork.methods.tipPost(e).send({from:this.state.accounts,value: window.web3.utils.toWei('0.1', 'ether')})
    this.setState({loading:false})
  }
   
  render() {
    return (
      <div>
        <Navbar account={this.state.accounts}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {this.state.loading ?
                  <div id="loader" className='text-center'><p>Loading...</p></div>
                  :
                  <Main  posts={this.state.posts} postContent={this.createPost} tip={this.tipAmount}/>
                }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
