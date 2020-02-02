import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import DogBreedContract from "./contracts/DogBreedContract";


class Form extends Component {
   
        state = {
            dogname: "",
            dogbreed: "",
            grooming: "",
            age: "",
            dogid: "",
            price: "",
            certified: "",
            status: "",
            seller: ""  
        };

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
            const add = await instance.methods.addDog("","","","","","").call();
            

           this.setState({ verifier, add, web3, accounts, contract: instance}, this.runExample);
         
            };
    

        handleSubmit = async (e) => {
            e.preventDefault();
            this.setState({
                dogname: "",
                dogbreed: "",
                grooming: "",
                age: "",
                dogid: "",
                price: "",
                certified: "",
                status: "",
                seller: ""      
            })

            this.handleSubmit = this.handleSubmit.bind(this);

          

           
           
        };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h1> This Is A Form For Adding Dogs</h1>
             <label for="dogname">Name of The Dog:  </label>
                <input 
                    placeholder="Dog's Name"
                    value={this.state.dogname} 
                    onChange={e => this.setState({dogname: e.target.value})} 
                    />
                    <br />
            <label for="dogbreed">Breed of The Dog:  </label>
                <input 
                    placeholder=" Dog's Breed"
                    value={this.state.dogbreed} 
                    onChange={e => this.setState({dogbreed: e.target.value})} 
                    />
                     <br />
             <label for="grooming">Monthly Grooming Cost:  </label>
                <input 
                    placeholder=" Grooming Cost"
                    value={this.state.grooming} 
                    onChange={e => this.setState({grooming: e.target.value})} 
                    />
                     <br />
            <label for="age">Age of the Dog:  </label>
                <input 
                    placeholder=" Age of The Dog"
                    value={this.state.age} 
                    onChange={e => this.setState({age: e.target.value})} 
                    />
                     <br />
            <label for="dogid">Id Number of The Dog:  </label>
                <input 
                    placeholder=" Dog's Id number"
                    value={this.state.dogid} 
                    onChange={e => this.setState({dogid: e.target.value})} 
                    />
                     <br />
            <label for="price">Price of The Dog (In Ether):  </label>
                <input 
                    placeholder=" Price of Dog In Ether  "
                    value={this.state.price} 
                    onChange={e => this.setState({price: e.target.value})} 
                    />
                     <br />
            <label for="certified">Is The Dog Certified:  </label>
                <input 
                    placeholder=" Is The Dog Certified"
                    value={this.state.certified} 
                    onChange={e => this.setState({certified: e.target.nodeValue})}
                    />
                     <br />
            <label for="status">Status of The Dog:  </label>
                <input 
                    placeholder=" Status of The Dog"
                    value={this.state.status} 
                    onChange={e => this.setState({status: e.target.value})} 
                    />
                     <br />
            <label for="seller">Seller of The Dog:  </label>
                <input 
                    placeholder=" Seller of The Dog"
                    value={this.state.seller} 
                    onChange={e => this.setState({seller: e.target.value})} 
                    />
                     <br />
                     <br />
                <button onClick={(e) => this.handleSubmit(e)}>

                    Submit Form
                </button>
            </form>
        );
    }
}

export default Form;