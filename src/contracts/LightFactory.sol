//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ILightAgora.sol";
import "./LightGenerator.sol";
import "./ILightFactory.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// TO DO: change checkIfTokenHolder to a mapping with boolean?
// TO DO: change to several owner - whitelist?
// TO DO: implement VRFV2 for NFTs rarity?
// TO DO:
// TO DO:

contract LightFactory is ILightFactory, ERC721URIStorage, VRFConsumerBaseV2 {

    address public immutable agoraAddress;

    // enum LightIMG {
    //     BASIC,
    //     SAND,
    //     CAKE,
    //     NIGHT
    // }

    /* NFT variables */
    string[4] public s_CLTokenUris;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    uint256 public currentNFTPriceInUSD;
    uint256 public tokenCount;
    mapping(uint256 => string) public s_requestToGenName;
    mapping(uint256 => LightGenerator) public tokenIDToGenerator;
    // mapping(address => bool) public addressOwnsToken; // could be useful

    /* Price feed variables */
    AggregatorV3Interface internal ETHUSDPriceFeed;
    address priceFeedAddress;

    /* VRF variables */
    VRFCoordinatorV2Interface public COORDINATOR;
    uint64 public s_subscriptionId;
    bytes32 public keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint32 public callbackGasLimit = 500000; // the coordinator hardcodes this value as max gas for the testnet
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;
    // VRF requests mapping
    mapping(uint256 => address) public s_requestIdToSender;

    constructor(
        address _agora,
        address _priceFeedAddress,
        address _vrfCoordinator,
        uint64 _subID
    ) ERC721("Light Maker", "VIBE") VRFConsumerBaseV2(_vrfCoordinator) {
        // ethusd price feed address on rinkeby : 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e

        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        s_subscriptionId = _subID;

        agoraAddress = _agora;
        priceFeedAddress = _priceFeedAddress;
        ETHUSDPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        currentNFTPriceInUSD = 100 * 10**18;
        tokenCount = 0;
        _initTokenUriList();
    }

    modifier onlyAgora {
       require(msg.sender == agoraAddress, "only Agora");
        _;
    }

    function setNFTPrice(uint256 price) external onlyAgora {
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

    function mintGenerator(string memory _name) public payable returns (uint256 requestId) {
        require(msg.value >= getNFTPriceInETH(),"Not Enough Eth to purchase NFT.");
        // IAgora(agoraAddress).receivePayment(msg.value);
        (bool sent,) = agoraAddress.call{value:msg.value}("");
        require(sent, "Failed to purchase NFT. Send Eth to buy.");

        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        s_requestIdToSender[requestId] = msg.sender;
        s_requestToGenName[requestId] = _name;

        // The natural order would be to deploy the generator contract in the fulfill randomness function
        // However the gas cost to deploy is too high (about 4.6M): the COORDINATOR has a hard cap of 2.5M gwei gas
        // The trick is then to deploy the contract here and mint the NFT key later.. however the risk is to have a
        // fail mint in the fulfillRandomWords function... to be addressed
        LightGenerator generator = new LightGenerator(
            agoraAddress,
            address(this),
            tokenCount,
            s_requestToGenName[requestId],
            priceFeedAddress
        );
        ILightAgora(agoraAddress).mintTokens(address(generator));
        tokenIDToGenerator[tokenCount] = generator;
        // tokenCount++; we can add token++ here and do a token-- in the fulfill function
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address tokenOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = tokenCount;
        tokenCount++;
        uint256 randNum = randomWords[0] % MAX_CHANCE_VALUE;
        uint256 imgIndex = getTypeFromRarityScale(randNum);
        _safeMint(tokenOwner, newTokenId);
        _setTokenURI(newTokenId, s_CLTokenUris[imgIndex]);
        // LightGenerator generator = new LightGenerator(
        //     agoraAddress,
        //     address(this),
        //     tokenCount,
        //     s_requestToGenName[requestId],
        //     priceFeedAddress
        // );
        // ILightAgora(agoraAddress).mintTokens(address(generator));
        // tokenIDToGenerator[tokenCount] = generator;

    }

    function _initTokenUriList() internal {
        s_CLTokenUris = [
            "https://ipfs.io/ipfs/QmNj7w9ANHCEs7MYG3c5Xh97FTJCNnPXrqnvxhV1MDGTtG?filename=Candy_Lamp_JSON.json",
            "https://ipfs.io/ipfs/QmdspNDZ6LQgiHwFgJRioSqYy4LuFhtxm3tkKcPoBGkSxC?filename=Candy_Lamp_sand_JSON.json",
            "https://ipfs.io/ipfs/QmTnREAELq9evUCxGGX9p7cZJWiXVkL9d4WyfZkeQXinTM?filename=Candy_Lamp_cake_JSON.json",
            "https://ipfs.io/ipfs/QmQFKHULie3c84h8LLMP91D3KdsPqbdhS9BoCw36fz8uCB?filename=Candy_Lamp_night_JSON.json"
        ];
    }

    function getChanceArray() public pure returns (uint256[4] memory) {
        return [50, 80, 95, MAX_CHANCE_VALUE];
    }

    function getTypeFromRarityScale(uint256 _randNum) public pure returns(uint256 i){
        uint256[4] memory chanceArray = getChanceArray();
        for (i = 0; i < chanceArray.length; i++) {
            if (_randNum < chanceArray[i]) {
                return i;
            }
        }
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
