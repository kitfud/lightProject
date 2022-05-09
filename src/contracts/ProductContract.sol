//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './ILightGenerator.sol';

//  add a lottery

contract ProductContract {
    uint256 public immutable id;
    string public productName;
    uint256 public productPrice;
    address payable public owner;
    address payable public linkedGenerator;

    event ProductSold(
        uint256 indexed _id,
        address buyer,
        uint256 price,
        uint256 timestamp
    );
    event Deposit(address indexed payee, uint256 value, uint256 time, uint256 currentContractBalance);
    event Withdraw(uint256 time, uint256 amount, address indexed owner);

    constructor(uint256 _id, string memory _name, uint256 _price, address _owner) payable {
        id = _id;
        productName = _name;
        productPrice = _price;
        linkedGenerator = payable(msg.sender);
        owner = payable(_owner);
    }

    // Remove and replace by a delegatecall ?
    modifier onlyOwner(address _entity) {
        require(msg.sender == _entity, 'Only owner');
        _;
    }

    // could change the price while someone is buying but it would be reverted if higher
    // so it shouldn't be a problem
    // Maybe just create a new Product contract
    // Or add a marker that only allows a pricechange when certain conditions are met?
    function changePrice(uint256 newUSDPrice) external onlyOwner(linkedGenerator) {
        productPrice = newUSDPrice;
    }

    function getProductPriceInETH() public view returns(uint256){
        return ILightGenerator(linkedGenerator).getProductPriceInETH(id);
    }

    // function changeName(string memory newName) public onlyOwner(linkedGenerator) {
    //     productName = newName;
    // }

    function withdraw() payable external onlyOwner(owner) {
        uint256 contractBalance = address(this).balance;
        (bool sent,) = owner.call{value:address(this).balance}("");
        require(sent, 'Failed to Send Ether To Owner');
        emit Withdraw(block.timestamp, contractBalance, owner);
    }

    function destroy() external onlyOwner(linkedGenerator) {
        selfdestruct(payable(owner));
    }

    receive() external payable {
        require(msg.value >= getProductPriceInETH(), "amount sent too low");
        require(msg.value < getProductPriceInETH() + 1*10**10, "amount sent too high");
        emit Deposit(msg.sender, msg.value,block.timestamp, address(this).balance);
    }
}
