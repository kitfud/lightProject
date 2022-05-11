//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./ProductContract.sol";
import "./ILightGenerator.sol";

// TO DO: decide if the products will only be local or a contract
// TO DO: change the factory contract call to an interface call and use only the needed functions.
// MAYBE: The aggregator function could be removed and imported from an ILightFactory interface.. try
//        Or if we opt for an NFT price in ETH, the aggregator won'y be needed in the factory contract.
// TO DO: Think about te lottery logic and the NFT generation for each light bought.

contract LightGenerator is ILightGenerator {
    address public factoryAddress;
    uint256 public immutable tokenId;
    uint256 public productCount;
    string public generatorName;
    uint256 public selectedProductId;
    bool public canSelectProduct;

    struct Product {
        uint256 id;
        string name;
        uint256 priceUSD;
        address contractAddress;
    }

    AggregatorV3Interface internal ETHUSDPriceFeed;
    Product[] public productsCompleteHistory; // products history, record of all products ever added or modified until reinitialized
    mapping(uint256 => Product) public idToProduct; // keep in mind mappings cannot be deleted in solidity
    mapping(string => Product) public nameToProduct;
    mapping(uint256 => address) public idToProductContract;
    ProductContract[] public productContracts;

    event ProductSold(
        uint256 indexed _id,
        address buyer,
        uint256 price,
        uint256 timestamp
    );
    event ProductAdded(uint256 indexed _id, string name, uint256 timestamp);
    event Deposit(
        address indexed payee,
        uint256 value,
        uint256 time,
        uint256 currentContractBalance
    );
    event Withdraw(uint256 time, uint256 amount, address indexed owner);

    constructor(
        address _factoryAddress,
        uint256 id,
        string memory _name,
        address _priceFeedAddress
    ) payable {
        // ethusd price feed address on rinkeby : 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        ETHUSDPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        factoryAddress = _factoryAddress; // create an interface - should lower the gas
        tokenId = id;
        generatorName = _name;
    }

    modifier onlyOwner() {
        require(msg.sender == IERC721(factoryAddress).ownerOf(tokenId), "Restricted to token owner");
        _;
    }

    function changeName(string memory _newName) external onlyOwner {
        generatorName = _newName;
    }

    // remove - gas reasons

    function getBalance() public view onlyOwner returns(uint256 balance){
        balance = address(this).balance;
    }


    function withdraw() external onlyOwner returns(uint256){
        uint256 contractBalance;
        address owner = IERC721(factoryAddress).ownerOf(tokenId);
        for (uint i ; i<productCount ; i++) {
            uint256 tempProductBalance = idToProductContract[i].balance;
            if (tempProductBalance > 0) {
                contractBalance += tempProductBalance;
                (bool sent, ) = owner.call{value: tempProductBalance}("");
                require(sent, "Failed to Send Ether To Owner");
            }
        }
        emit Withdraw(block.timestamp, contractBalance, owner);
        return contractBalance;
    }

    // remove - gas reasons
    // function getAddress() public view returns (address){
    //     return address(this);
    // }


    function getProductPriceInETH(uint256 productId)
        public
        view
        returns (uint256)
    {
        uint256 precision = 1 * 10**18;
        uint256 productPriceinUSD = idToProduct[productId].priceUSD;
        return (productPriceinUSD * precision) / getETHUSDConversionRate();
    }

    function getETHUSDConversionRate() public view returns (uint256) {
        (, int256 price, , , ) = ETHUSDPriceFeed.latestRoundData();
        uint256 factor = 18 - ETHUSDPriceFeed.decimals();
        return uint256(price) * 10**factor;
    }

    function changeProductPrice(uint256 _id, uint256 _priceUSD)
        external
        onlyOwner
    {
        Product memory currentProduct = idToProduct[_id];
        Product memory modProduct = Product(
            currentProduct.id,
            currentProduct.name,
            _priceUSD,
            currentProduct.contractAddress
        );
        productsCompleteHistory.push(modProduct);
        idToProduct[currentProduct.id] = modProduct;
        nameToProduct[currentProduct.name] = modProduct;
        productContracts[_id].changePrice(_priceUSD);
    }

    // In case we want to create a product selector before payment
    // - works together with the boolean canSelectProduct -
    // should not work though because people could exhaust the account
    // by changing the product selection wityhout buying
    function selectProduct(uint256 _productId) external {
        require(canSelectProduct, "An operation is already ongoin");
        require(_productId < productCount, "Product not listed");
        selectedProductId = _productId;
    }

    function buyProduct(uint256 productId) external payable {
        uint256 priceETH = getProductPriceInETH(productId);
        require(
            msg.value >= priceETH,
            "Not Enough ETH to purchase the product."
        );
        emit Deposit(
            msg.sender,
            msg.value,
            block.timestamp,
            address(this).balance
        );
        emit ProductSold(productId, msg.sender, priceETH, block.timestamp);
    }

    function fund() external payable {
        emit Deposit(
            msg.sender,
            msg.value,
            block.timestamp,
            address(this).balance
        );
    }

    function addProduct(string memory _name, uint256 _price) public onlyOwner {
        address owner = IERC721(factoryAddress).ownerOf(tokenId);
        ProductContract newContract = new ProductContract(productCount, _name, _price, owner);
        productContracts.push(newContract);
        idToProductContract[productCount] = payable(newContract);

        Product memory newProduct = Product(productCount, _name, _price, idToProductContract[productCount]);
        productsCompleteHistory.push(newProduct);
        idToProduct[productCount] = newProduct;
        nameToProduct[_name] = newProduct;

        emit ProductAdded(productCount, _name, block.timestamp);
        productCount++;
    }

    function reinitializeProductsHistory() public onlyOwner {
        // Will cost a lot of gas if the product list is large, careful
        delete productsCompleteHistory;
        for (uint256 i; i < productCount; i++) {
            Product memory prod = idToProduct[i];
            string memory prodName = prod.name;
            delete idToProduct[i];
            delete nameToProduct[prodName];
            productContracts[i].destroy();
        }
        productCount = 0;
    }

    // function getAllAvailableProducts() public view returns(bool[] memory){
    //     bool[] memory productList;
    //     for (uint i=0 ; i<productCount ; i++){
    //         productList[i] = idToProduct[i];
    //     }
    //     return productList;
    // }

    // // metamask cannot handle function calls but MyCrypto can.
    // fallback() external payable {
    //     // we can try top implement a diff check, the closest to 0 and within +- 10Gwei is selected
    //     buyProduct()
    // }
    // 2300 gas max
    receive() external payable {
        emit Deposit(
            msg.sender,
            msg.value,
            block.timestamp,
            address(this).balance
        );
    }
}
