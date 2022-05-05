//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import "./LightFactory.sol";

// TO DO: decide if the products will only be local or a contract

contract LightGenerator {

    LightFactory public factory;
    uint256 public tokenId;
    uint256 public productCount;
    string  public generatorName;
    // add a product object
    struct Product {
        uint256 id;
        string name;
        uint256 priceUSD;
    }

    AggregatorV3Interface internal ETHUSDPriceFeed;
    Product[] public products; // products history, record of all products ever added until reinitialized
    mapping(uint256 => Product) public idToProduct; // keep in mind mappings cannot be deleted in solidity
    mapping(string => Product) public nameToProduct;
    // mapping(uint256 => bool) public productAvailable;
    event ProductSold(
        uint256 indexed _id,
        address buyer,
        uint256 price,
        uint256 timestamp
    );
    event ProductAdded(
        uint256 indexed _id,
        string name,
        uint256 timestamp
    );
    event Deposit(address indexed payee, uint256 value, uint256 time, uint256 currentContractBalance);
    event Withdraw(uint256 time, uint256 amount, address indexed owner);

    constructor (LightFactory _factory, uint256 id, string memory _name, address _priceFeedAddress) payable {
        // ethusd price feed address on rinkeby : 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        ETHUSDPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        factory = _factory;
        tokenId = id;
        generatorName = _name;
    }

    modifier onlyOwner {
        require(msg.sender == factory.ownerOf(tokenId), "Restricted to token owner");
        _;
    }

    function changeName(string memory _newName) external onlyOwner {
        generatorName = _newName;
    }

    function getBalance() public view onlyOwner returns(uint256 balance){
        balance = address(this).balance;
    }

    function withdraw() public onlyOwner() {
        uint256 contractBalance = address(this).balance;
        address owner = factory.ownerOf(tokenId);
        (bool sent,) = owner.call{value:address(this).balance}("");
        require(sent,"Failed to Send Ether To Owner");
        emit Withdraw(block.timestamp, contractBalance, owner);
    }

    function getAddress() public view returns (address){
        return address(this);
    }

    function getProductPriceInETH(uint256 productId) public view returns(uint256) {
        uint256 precision = 1 * 10**18;
        uint256 productPriceinUSD = idToProduct[productId].priceUSD;
        return (productPriceinUSD * precision)/getETHUSDConversionRate();
    }

    function getETHUSDConversionRate() public view returns(uint256) {
        (,int256 price,,,) = ETHUSDPriceFeed.latestRoundData();
        uint256 factor = 18 - ETHUSDPriceFeed.decimals();
        return uint256(price)* 10**factor;
    }

    function changeProductPrice(uint256 _id, uint256 _priceUSD) external onlyOwner {
        Product memory currentProduct = idToProduct[_id];
        Product memory modProduct = Product(
            currentProduct.id,
            currentProduct.name,
            _priceUSD
        );
        products.push(modProduct);
        idToProduct[currentProduct.id] = modProduct;
        nameToProduct[currentProduct.name] = modProduct;
    }

    function buyProduct(uint256 productId) payable external {
        uint256 priceETH = getProductPriceInETH(productId);
        require(msg.value >= priceETH, "Not Enough ETH to purchase the product.");
        emit Deposit(msg.sender, msg.value, block.timestamp, address(this).balance);
        emit ProductSold(productId, msg.sender, priceETH, block.timestamp);
    }

    function fund() payable external {
        emit Deposit(msg.sender, msg.value,block.timestamp, address(this).balance);
    }

    function addProduct(string memory _name, uint256 _price) public onlyOwner {
        Product memory newProduct = Product(productCount, _name, _price);
        products.push(newProduct);
        idToProduct[productCount] = newProduct;
        nameToProduct[_name] = newProduct;
        emit ProductAdded(productCount, _name, block.timestamp);
        productCount++ ;
    }

    function reinitializeProductsHistory() public onlyOwner {
        // Will cost a lot of gas if the product list is large, careful
        delete products;
        for (uint256 i ; i<productCount ; i++) {
            Product memory prod = idToProduct[i];
            string memory prodName = prod.name;
            delete idToProduct[i];
            delete nameToProduct[prodName];
        }
        productCount = 0;
    }

    function getAllAvailableProducts() public view returns(Product[] memory){
        Product[] memory productList;
        for (uint i=0 ; i<productCount ; i++){
            productList[i] = idToProduct[i];
        }
        return productList;
    }

    receive() external payable{
        emit Deposit(msg.sender, msg.value,block.timestamp, address(this).balance);
    }
}
