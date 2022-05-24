//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import './ILightAgora.sol';
import './LightGenerator.sol';
import './ILightFactory.sol';

// TO DO: implement VRFV2 for NFTs rarity?

contract LightFactory is ILightFactory, ERC721URIStorage {
    address public immutable agoraAddress;

    string public NFT_URI =
        'https://ipfs.io/ipfs/QmfN7WjsL6FiWV4fkSEgTVqUsywUnYCoAe7SVntXukUcVN?filename=CandyLamp.json';
    uint256 public currentNFTPriceInUSD;
    uint256 public tokenCount;

    AggregatorV3Interface internal ETHUSDPriceFeed;
    address priceFeedAddress; // pass to the Light Generator constructor when deployed

    mapping(uint256 => LightGenerator) public tokenIDToGenerator;

    // mapping(address => bool) public addressOwnsToken; // could be useful

    constructor(address _agora, address _priceFeedAddress) ERC721('Light Maker', 'VIBE') {
        agoraAddress = _agora;
        // ethusd price feed address on rinkeby : 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        priceFeedAddress = _priceFeedAddress;
        ETHUSDPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        currentNFTPriceInUSD = 100 * 10**18;
    }

    modifier onlyAgora() {
        require(msg.sender == agoraAddress, 'only Agora');
        _;
    }

    function setNFTPrice(uint256 price) external onlyAgora {
        currentNFTPriceInUSD = price;
    }

    // get NFT price in ETH
    function getNFTPriceInETH() public view returns (uint256) {
        uint256 precision = 1 * 10**18;
        return (currentNFTPriceInUSD * precision) / getETHUSDConversionRate();
    }

    function getETHUSDConversionRate() public view returns (uint256) {
        (, int256 price, , , ) = ETHUSDPriceFeed.latestRoundData();
        uint256 factor = 18 - ETHUSDPriceFeed.decimals();
        return uint256(price) * 10**factor;
    }

    function mintGenerator(string memory _name) public payable {
        require(msg.value >= getNFTPriceInETH(), 'Not Enough Eth to purchase NFT.');
        // IAgora(agoraAddress).receivePayment(msg.value);
        (bool sent, ) = agoraAddress.call{value: msg.value}('');
        require(sent, 'Failed to purchase NFT. Send Eth to buy.');

        uint256 newTokenId = tokenCount;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, NFT_URI);
        LightGenerator generator = new LightGenerator(
            agoraAddress,
            address(this),
            tokenCount,
            _name,
            priceFeedAddress
        );
        ILightAgora(agoraAddress).mintTokens(address(generator));
        tokenIDToGenerator[tokenCount] = generator;
        tokenCount++;
    }

    function checkTokenOwnerById(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function addressToTokenID(address _account) public view returns (bool[] memory) {
        uint256 _tokenCount = tokenCount;
        bool[] memory values = new bool[](_tokenCount);
        for (uint256 i = 0; i < _tokenCount; unsafe_inc(i)) {
            if (_isApprovedOrOwner(_account, i)) {
                values[i] = true;
            }
        }
        return values;
    }

    function unsafe_inc(uint256 x) private pure returns (uint256) {
        unchecked {
            return x + 1;
        }
    }
}
