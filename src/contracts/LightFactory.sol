//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./LightGenerator.sol";

// TO DO: change checkIfTokenHolder to a mapping with boolean?
// TO DO: change to several owner - whitelist?
// TO DO: implement VRFV2 for NFTs rarity?
// TO DO:
// TO DO:

contract LightFactory is ERC721URIStorage, Ownable {

    string public NFT_URI = "https://ipfs.io/ipfs/QmfN7WjsL6FiWV4fkSEgTVqUsywUnYCoAe7SVntXukUcVN?filename=CandyLamp.json";

    uint256 public currentNFTPriceInUSD;
    uint256 public tokenCount;

    AggregatorV3Interface internal ETHUSDPriceFeed;
    address priceFeedAddress; // pass to the Light Generator constructor when deployed

    mapping(uint256 => LightGenerator) public tokenIDToGenerator;
    // mapping(address => bool) public addressOwnsToken; // could be useful

    constructor(address _priceFeedAddress) ERC721('Light Maker', 'VIBE') {
        // ethusd price feed address on rinkeby : 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        priceFeedAddress = _priceFeedAddress;
        ETHUSDPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        currentNFTPriceInUSD = 100 * 10**18;
        tokenCount = 0;
    }

    function setNFTPrice(uint256 price) public onlyOwner {
        currentNFTPriceInUSD = price;
    }

    // get NFT price in ETH
    function getNFTPriceInETH() public view returns(uint256) {
        uint256 precision = 1 * 10**18;
        return (currentNFTPriceInUSD * precision)/getETHUSDConversionRate();
    }

    function getETHUSDConversionRate() public view returns(uint256) {
        (,int256 price,,,) = ETHUSDPriceFeed.latestRoundData();
        uint256 factor = 18 - ETHUSDPriceFeed.decimals();
        return uint256(price)* 10**factor;
    }

    function mintGenerator(string memory _name) public payable {
        require(msg.value >= getNFTPriceInETH(),"Not Enough Eth to purchase NFT.");
        // Change this to manage multiple addresses
        (bool sent,) = owner().call{value:msg.value}("");
        require(sent, "Failed to purchase NFT. Send Eth to buy.");

        uint256 newTokenId = tokenCount;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, NFT_URI);
        LightGenerator generator = new LightGenerator(
            address(this),
            tokenCount,
            _name,
            priceFeedAddress
        );
        tokenIDToGenerator[tokenCount] = generator;
        tokenCount++;
    }

    function checkTokenOwnerById(uint tokenId) public view returns(address) {
        return ownerOf(tokenId);
    }


    function checkIfTokenHolder(address toSearch) public view returns(bool) {
        for (uint i=0 ; i<tokenCount ; i++){
            if(checkTokenOwnerById(i)== toSearch){
                return true;
            }
        }
        return false;
    }

    // check if a boolean mapping could work
    function addressToTokenID(address toSearch) public view returns(bool[] memory){
         bool[] memory values = new bool[](tokenCount);
         for (uint i=0 ; i<tokenCount ; i++){
            if(checkTokenOwnerById(i) == toSearch){
                values[i] = true;
            }
        }
        return values;
    }

    // remove for gas optimization
    // function getGeneratorContractAddressByToken(uint256 tokenId) public view returns (address){
    //     return tokenIDToGenerator[tokenId].getAddress();
    // }

}
