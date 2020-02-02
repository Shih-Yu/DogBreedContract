pragma solidity >=0.5.0 <0.6.0;

/// @title Verified Dog Breed Contract
/// @author Shih-Yu Hwang
/// @notice A contract to buy and sell verified dog breeds
/// @dev    This contract is still a work in progress


/// @dev importing Openzeppelin Pausable contract as circut breaker
import "@openzeppelin/contracts/lifecycle/Pausable.sol";

contract DogBreedContract is Pausable {
    
    

 /// @notice declaring state variables: address of the verifier 
 /// and tracks dogs added in the list
 address public verifier;
 uint public dogIdCount;
 
 /// @notice declaring enum for the states of the dog status
 enum State {ForSale, Sold, Received}


 /// @notice mapping dog Id to dog name
 mapping (uint => Dog) dogs;
 
 
 /// @notice displays the verifier address and track how many dogs there are
 /// when the contract is called
 constructor() Pausable() public {
     verifier = msg.sender;
     dogIdCount = 1;
 }
    

 /// @notice struct for labeling specifications of each dog
     struct Dog {
        string name;
        string breed;
        uint groomingCost;
        uint age;
        uint dogId;
        uint price;
        bool certified;
        State state;
        address payable seller;
        address payable buyer;
    }
    
/// @notice events for adding a dog, buying a dog, and dog received
    event AddingDog(uint _dogId);
    event BoughtDog(uint _dogId);
    event ReceivedDog(uint _dogId);
    
/// @notice modifiers to make sure the states are correct for selling, sold, received
    modifier forSale(uint _dogId){require(dogs[_dogId].state == State.ForSale);_;}
    modifier sold(uint _dogId){require(dogs[_dogId].state == State.Sold);_;}
    modifier received(uint _dogId){require(dogs[_dogId].state == State.Received);_;}
    
// @notice function to add new dog to list only by verifier
// @param get all the struct information name, breed, groomongcost,
// age, dogId, price, certified in order to add dogs to the list
// @return the address calling the function is the verifier

    function addDog(string memory _name, string memory _breed, uint _groomingCost, uint _age,uint _price, bool _certified) public returns(bool){
       emit AddingDog(dogIdCount);
       dogs[dogIdCount] = Dog({
           name: _name, 
           breed: _breed, 
           groomingCost: _groomingCost, 
           age: _age, 
           dogId: dogIdCount, 
           price: _price, 
           certified: _certified, 
           state: State.ForSale, 
           seller: msg.sender,
           buyer: address(0)
       });
       dogIdCount += 1;
       return true;
    }


 // @notice function to certifiy dogs added for sale
 // @param get the _dogId to identify the dogs to get certified
 function certify(uint _dogId) whenNotPaused() public {
     require (verifier == msg.sender, "Only verifier can add dogs");
     dogs[_dogId].certified = true;
}



// @notice function to buy dog from the list
// @param gets the _dogId to pull up the dog the buyer wishes to buy
// and then emits a BoughtDog event when the dog is bought

function buyDog(uint _dogId) whenNotPaused() public payable forSale(dogs[_dogId].dogId) {
    require(dogs[_dogId].certified == true, "Dog Must Be Certified To Buy");
    require(dogs[_dogId].state == State.ForSale);
    require(msg.value >= dogs[_dogId].price);
    emit BoughtDog(dogIdCount);
    dogs[_dogId].seller.transfer(dogs[_dogId].price);
    dogs[_dogId].state = State.Sold;
    dogs[_dogId].buyer = msg.sender;
}


// @notice function to mark the dog bought as received by the buyer
// @param gets the _dogId to pull up the dog the buyer bought and
// emits a ReceivedDog event when the buyer marks the dog as received
function receivedDog(uint _dogId) public  received(dogs[_dogId].dogId) {
require(dogs[_dogId].buyer == msg.sender);
   emit ReceivedDog(dogIdCount);
   dogs[_dogId].state = State.Received;
   dogs[_dogId].buyer = msg.sender;
}

// @notice function gets all the information on a dog in the list
// @param gets the _dogId to get all the information on a dog in the list
// @return information retrieved from inputting _dogId, name, breed, groomingcost
// age, dogId, price, certified, state, seller, buyer
function getDog(uint _dogId) public view returns (string memory name, string memory breed, uint groomingCost, uint age, uint dogId, uint price, bool certified,  uint state, address seller, address buyer) {
    name = dogs[_dogId].name;
    breed = dogs[_dogId].breed;
    groomingCost = dogs[_dogId].groomingCost;
    age = dogs[_dogId].age;
    dogId = dogs[_dogId].dogId;
    price = dogs[_dogId].price;
    certified = dogs[_dogId].certified;
    state = uint (dogs[_dogId].state);
    seller = dogs[_dogId].seller;
    buyer = dogs[_dogId].buyer;
    return (name, breed, groomingCost, age, dogId, price, certified,  state, seller, buyer);
}
}
