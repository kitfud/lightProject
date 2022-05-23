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
    // To deal with the incoming queue of requests for a product that takes physical time with a bottleneck
    // like a device that generates light, we can go 2 routes:
    //  - a boolean variable canOrderProduct that must be true for the function to go through
    //    we can use a time like Gelato or use the block number/timestamp and a delta.
    //    here we'll choose block.number
    //  - a Queue of requests that we deal with over time.
    // bool public canOrderProduct;
    uint256 public blockNumLimit;
    uint8 public serviceDuration; // specific to the lights proof of concept
    // uint256 public requestCounter;
    // mapping(uint256 => address) public requestQueue;
    // mapping(uint256 => bool) public requestFulfilled;
    // mapping(address => string[3]) public userToRequest;


    event ProductSold(
        uint256 indexed _id,
        address buyer,
        uint256 price,
        uint256 timestamp,
        string[3] data
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
        serviceDuration = 5; // specific to the lights proof of concept
    }

    // Remove and replace by a delegatecall ?
    modifier onlyOwner(address _entity) {
        require(msg.sender == _entity, "Only owner");
        _;
    }

    function changePrice(uint256 newUSDPrice) external onlyOwner(linkedGenerator) {
        productPrice = newUSDPrice;
    }

    function changeDuration(uint8 _numBlocks) external {
        require(msg.sender == IERC721(factoryAddress).ownerOf(tokenId), "Only owner");
        serviceDuration = _numBlocks;
    }

    function getProductPriceInETH() public view returns(uint256){
        return ILightGenerator(linkedGenerator).getProductPriceInETH(id);
    }

    // function changeName(string memory newName) public onlyOwner(linkedGenerator) {
    //     productName = newName;
    // }

    // payment can be sent durectly to this contract address to buy the product
    // But the user can also call this function to buy the product - here the RGB values
    // selected are passed through the blockchain
    function buyProduct(string[3] memory rgbString) external payable {
        require(block.number > blockNumLimit, "Processing... Please try again");
        uint256 priceETH = getProductPriceInETH();
        require(msg.value >= priceETH, "Not enough ETH to buy the item");

        blockNumLimit = block.number + serviceDuration;
        // requestQueue[requestCounter] = msg.sender;
        // userToRequest[requestCounter] = rgbString;
        // requestCounter++;
        // // and deal with the requestFulfilled mapping once the lights are changed

        emit ProductSold(id, msg.sender, priceETH, block.timestamp, rgbString);
    }

    function withdraw() external {
        address owner = IERC721(factoryAddress).ownerOf(tokenId);
        require(msg.sender == owner || msg.sender == linkedGenerator, "not allowed");
        uint256 contractBalance = address(this).balance;
        (bool sent,) = owner.call{value:contractBalance}("");
        require(sent, "Failed to Send Eth To Owner");
        emit Withdraw(block.timestamp, contractBalance, owner);
    }

    function destroy() external onlyOwner(linkedGenerator) {
        address owner = IERC721(factoryAddress).ownerOf(tokenId);
        selfdestruct(payable(owner));
    }

    receive() external payable {
        // Same as in the buyProduct function - we may need both entry points
        require(block.number > blockNumLimit, "Processing... Please try again");
        require(msg.value >= getProductPriceInETH(), "amount sent too low");
        blockNumLimit = block.number + serviceDuration;
        emit Deposit(msg.sender, msg.value,block.timestamp, address(this).balance);
    }
}
