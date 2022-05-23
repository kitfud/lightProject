//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ProductContract.sol";
import "./ILightGenerator.sol";

// TO DO: Think about te lottery logic and the NFT generation for each light bought.

contract LightGenerator is ILightGenerator {
    address public immutable factoryAddress;
    address public immutable agoraAddress;
    uint256 public immutable tokenId;
    uint256 public productCount;
    string public generatorName;
    // uint256 public selectedProductId;
    // bool public canSelectProduct;

    struct Product {
        uint256 id;
        string name;
        uint256 priceUSD;
        address contractAddress;
    }

    AggregatorV3Interface internal ETHUSDPriceFeed;
    Product[] public productsCompleteHistory; // products history, record of all products ever added or modified until reinitialized
    mapping(uint256 => Product) public idToProduct;
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
        address _agoraAddress,
        address _factoryAddress,
        uint256 _tokenId,
        string memory _name,
        address _priceFeedAddress
    ) payable {
        // ethusd price feed address on rinkeby : 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        ETHUSDPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        factoryAddress = _factoryAddress; // create an interface - should lower the gas
        agoraAddress = _agoraAddress;
        tokenId = _tokenId;
        generatorName = _name;
    }

    modifier onlyOwner() {
        require(msg.sender == IERC721(factoryAddress).ownerOf(tokenId), "Only owner");
        _;
    }

    function changeName(string memory _newName) external onlyOwner {
        generatorName = _newName;
    }

    function getBalance() public view onlyOwner returns(uint256 balance){
        balance = address(this).balance;
    }

    function withdraw() external onlyOwner returns(uint256){
        uint256 _prodCount = productCount;
        uint256 contractBalance;
        address owner = IERC721(factoryAddress).ownerOf(tokenId);
        for (uint i ; i < _prodCount ; unsafe_inc(i)) {
            uint256 tempProductBalance = idToProductContract[i].balance;
            if (tempProductBalance > 0) {
                contractBalance += tempProductBalance;
                productContracts[i].withdraw();
            }
        }
        emit Withdraw(block.timestamp, contractBalance, owner);
        return contractBalance;
    }


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

    // // In case we want to create a product selector before payment
    // // - works together with the boolean canSelectProduct -
    // // should not work though because people could exhaust the account
    // // by changing the product selection wityhout buying
    // function selectProduct(uint256 _productId) external {
    //     require(canSelectProduct, "An operation is already ongoing");
    //     require(_productId < productCount, "Product not listed");
    //     selectedProductId = _productId;
    // }

    function buyProduct(uint256 productId) external payable {
        uint256 priceETH = getProductPriceInETH(productId);
        require(msg.value >= priceETH, "Not Enough ETH to buy the item.");
        // emit Deposit(
        //     msg.sender,
        //     msg.value,
        //     block.timestamp,
        //     address(this).balance
        // );
        emit ProductSold(productId, msg.sender, priceETH, block.timestamp);
    }

    // function fund() external payable {
    //     emit Deposit(
    //         msg.sender,
    //         msg.value,
    //         block.timestamp,
    //         address(this).balance
    //     );
    // }

    function addProduct(string memory _name, uint256 _price) public onlyOwner {
        // address owner = IERC721(factoryAddress).ownerOf(tokenId);
        ProductContract newContract = new ProductContract(productCount, _name, _price, tokenId, factoryAddress);
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
        uint256 _prodCount = productCount;
        delete productsCompleteHistory;
        for (uint256 i; i < _prodCount; unsafe_inc(i)) {
            Product memory prod = idToProduct[i];
            string memory prodName = prod.name;
            delete idToProduct[i];
            delete nameToProduct[prodName];
            productContracts[i].destroy();
        }
        productCount = 0;
    }

    function unsafe_inc(uint x) private pure returns (uint) {
        unchecked { return x + 1; }
    }

    // can withdraw LIQ tokens to owner(only)
    function withdrawLIQTokens(uint256 amount) public onlyOwner {
        IERC20(agoraAddress).transfer(IERC721(factoryAddress).ownerOf(tokenId), amount);
    }

    receive() external payable {
        emit Deposit(
            msg.sender,
            msg.value,
            block.timestamp,
            address(this).balance
        );
    }
}
