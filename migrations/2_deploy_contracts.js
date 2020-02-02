var DogBreedContract = artifacts.require("./DogBreedContract.sol");

module.exports = function(deployer) {
  deployer.deploy(DogBreedContract);
};
