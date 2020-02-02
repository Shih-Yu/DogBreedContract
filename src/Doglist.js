import React, { Component } from "react";
import DogBreedContract from "./contracts/DogBreedContract";
//import Form from "./Form";
//import App from "./App";
import getWeb3 from "./getWeb3";


class Doglist extends Component {



        componentDidMount = async () => {
   
            const web3 = await getWeb3();
    
            const accounts = await web3.eth.getAccounts();

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = DogBreedContract.networks[networkId];
            const instance = new web3.eth.Contract(
              DogBreedContract.abi,
              deployedNetwork && deployedNetwork.address, 
            );
            
            
            const verifier = await instance.methods.verifier().call();
            const certified = await instance.methods.certified("").call();
            const buy = await instance.methods.buyDog("").call();
            

           this.setState({ verifier, buy, certified, web3, accounts, contract: instance}, this.runExample);
         
            };
    
    render() {
        return (
            <div>
                <h1>List of Dogs For Sale</h1>
                <div>
                
                </div>
            
            </div>
        )
    }
 


}

export default Doglist;