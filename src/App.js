import React, { Component } from "react";
import { Route, NavLink, HashRouter} from "react-router-dom";
import getWeb3 from "./getWeb3";
import DogBreedContract from "./contracts/DogBreedContract";
import './App.css';
import Home from "./Home";
import Doglist from "./Doglist";
import Form from "./Form";


class App extends Component {

  state = {
    verifier: null,
    web3: null,
    accounts: null,
    contract: null
   
  };

  
  
    componentDidMount = async () => {
   
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
      
      

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DogBreedContract.networks[networkId];
      const instance = new web3.eth.Contract(
        DogBreedContract.abi,
        deployedNetwork && deployedNetwork.address,
        
      );
      
      
      const verifier = await instance.methods.verifier().call();
      
     
        
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
     this.setState({ verifier, web3, accounts, contract: instance}, this.runExample);
   
      };
      
 /* runExample = async () => {
    const { verifier, accounts, contract, } = this.state;

    

    // Update state with the result.
    this.setState ({ verifier, accounts, contract });
  
  };*/
  
  render() {
    
  return (
    <HashRouter>
    <div>
      <h1>Dog Breed Contract</h1>
      <div>
      <h3>This contract is verified by: {this.state.verifier}</h3>
      </div>
        <ul className="header">
         <li><NavLink exact to="/">Home</NavLink></li>
         <li><NavLink to="/Doglist">Dogs For Sale</NavLink></li>
         <li><NavLink to="/Form">Sell Dogs</NavLink></li>
       </ul>
     <div className="content">
        <Route exact path="/" component={Home}/>
        <Route path="/Doglist" component={Doglist}/>
        <Route path="/Form" component={Form}/>
      </div> 
    </div>
    </HashRouter> 
  );
  }
};
export default App;
