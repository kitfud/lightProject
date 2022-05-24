//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ILightGenerator.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

//  add a lottery

contract ProductContract {
    uint256 public immutable id;
    uint256 public immutable tokenId;
    address public immutable factoryAddress;
    string public productName;
    uint256 public productPrice;
    address payable public linkedGenerator;

    event ProductSold(
        uint256 indexed _id,
        address buyer,
        uint256 price,
        uint256 timestamp
    );
    event Deposit(address indexed payee, uint256 value, uint256 time, uint256 currentContractBalance);
    event Withdraw(uint256 time, uint256 amount, address indexed owner);

    constructor(uint256 _id, string memory _name, uint256 _price, uint256 _tokenId, address _factoryAddress) payable {
        id = _id;
        tokenId = _tokenId; // the owner remains the NFT holder
        factoryAddress = _factoryAddress;
        productName = _name;
        productPrice = _price;
        linkedGenerator = payable(msg.sender);
    }

    // Remove and replace by a delegatecall ?
    modifier onlyOwner(address _entity) {
        require(msg.sender == _entity, "Only owner");
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

    function withdraw() external {
        address owner = IERC721(factoryAddress).ownerOf(tokenId);
        require(msg.sender == owner || msg.sender == linkedGenerator, "not allowed");
        uint256 contractBalance = address(this).balance;
        (bool sent,) = owner.call{value:contractBalance}("");
        require(sent, "Failed to Send Ether To Owner");
        emit Withdraw(block.timestamp, contractBalance, owner);
    }

    function destroy() external onlyOwner(linkedGenerator) {
        address owner = IERC721(factoryAddress).ownerOf(tokenId);
        selfdestruct(payable(owner));
    }

    receive() external payable {
        require(msg.value >= getProductPriceInETH(), "amount sent too low");
        emit Deposit(msg.sender, msg.value,block.timestamp, address(this).balance);
    }
}
