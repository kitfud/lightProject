//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ILightFactory.sol";
import "./LightFactory.sol";
import "./ILightAgora.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";


// TO DO: Add the ERC20 token mechanics here? Add roles?

contract LightAgora is ILightAgora, ERC20Burnable {
    // bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    // bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    address public immutable factoryAddress; // could change this to a container but not needed now.
    LightFactory public lightFactory; // change to immutable?

    uint256 votesCount;
    uint256 cumulativeCount;
    address[] public voters;
    mapping(address => bool) public isVoter;
    mapping(address => bool) public voterDidVote;
    // mapping(address => bool) public voterDidAgree; // no need for now
    // mapping(address => uint256) public voterToNewPrice; // no need for now
    mapping(address => bool) public canMint;
    mapping(address => bool) public canBurn;

    enum VOTE_STATE {
        ONGOING,
        SETTLED
    }
    VOTE_STATE public vote_state;

    /* VRF variables */
    VRFCoordinatorV2Interface COORDINATOR; //0x6168499c0cFfCaCD319c818142124B7A15E857ab
    LinkTokenInterface LINKTOKEN; //0x01BE23585060835E02B77ef475b0Cc51aA1e0709
    uint64 public s_subscriptionId;
    // bytes32 keyHash;
    // uint32 callbackGasLimit = 100000;
    // uint16 requestConfirmations = 11;
    // uint32 numWords = 1;
    // uint256 public s_requestId;
    // uint256 public s_randomWords; // We'll ask for only 1 number otherwise uint256[]

    constructor(
        uint256 initialSupply,
        address _priceFeedAddress,  // 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        address _vrfCoordinator,
        address _link
    ) ERC20("LiquidLight", "LIQ") {
// very simple behavior: mint tokens when a new generator is minted/deployed,
//                       a fixed supply for that specific generator
//                       when a user buys a product, the gen can send tokens
//                       once tokens are all out, the generator gets the right to burn tokens?
        voters = [
            msg.sender,
            0xa97e80DF47220afaD2D017a10b023B55FDB86293,
            0x8BDD43Eb657847d2dC730eb45e1288eb3f588A04,
            0xa65AA8747Fa0934d51315082336938696E80136E,
            0x9466b7430eC51c81e1F43dDCf69278878B559382
        ];


        for (uint i ; i<voters.length ; i++) {
            isVoter[voters[i]] = true;
            _mint(voters[i], initialSupply);
        }
        vote_state = VOTE_STATE.SETTLED;

        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(_link);
        createNewSubscription();

        lightFactory = new LightFactory(
            address(this),
            _priceFeedAddress,
            _vrfCoordinator,
            s_subscriptionId
        );
        factoryAddress = address(lightFactory);
        canMint[factoryAddress] = true;

        addConsumer(factoryAddress);
    }

    modifier onlyVoter {
        require(isVoter[msg.sender] == true, "you are not a voter");
        _;
    }

    // change for an Access control mechanism?
    modifier onlyMinter {
        require(canMint[msg.sender] == true, "No minting rights");
        _;
    }

    modifier onlyBurner {
        require(canBurn[msg.sender] == true, "No minting rights");
        _;
    }

    /*** ERC20 functions ***/
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function mintTokens(address generatorAddress) external onlyMinter {
        _mint(generatorAddress, 1000);
    }

    // Check burn in ERC20Burtnable.sol github - burn function and burnFrom
    function burnTokens(address account, uint256 amount) external onlyBurner {
        _burn(account, amount);
    }

    /*** VRF functions ***/
    function createNewSubscription() public onlyVoter {
        s_subscriptionId = COORDINATOR.createSubscription();
    }

    function addConsumer(address consumerAddress) public onlyVoter {
        COORDINATOR.addConsumer(s_subscriptionId, consumerAddress);
    }

    function topUpSubscription(uint256 amount) external payable onlyVoter {
        LINKTOKEN.transferAndCall(address(COORDINATOR), amount, abi.encode(s_subscriptionId));
    }

    function removeConsumer(address consumerAddress) external onlyVoter {
        COORDINATOR.removeConsumer(s_subscriptionId, consumerAddress);
    }

    function cancelSubscription(address receivingWallet) external onlyVoter {
        // Cancel the subscription and send the remaining LINK to a wallet address.
        COORDINATOR.cancelSubscription(s_subscriptionId, receivingWallet);
        s_subscriptionId = 0;
    }

    function withdraw(uint256 amount, address to) external onlyVoter {
        LINKTOKEN.transfer(to, amount);
    }


    /* Voting functions */
    function suggestNFTPriceChange(uint256 _newPrice) public onlyVoter {
        if (vote_state == VOTE_STATE.SETTLED){
            vote_state = VOTE_STATE.ONGOING;
        }
        require(voterDidVote[msg.sender] == false, "you already voted");
        uint256 _numVoters = voters.length;
        voterDidVote[msg.sender] = true;
        votesCount ++;
        cumulativeCount += _newPrice;
        if (votesCount == _numVoters) {
            vote_state = VOTE_STATE.SETTLED;
            ILightFactory(factoryAddress).setNFTPrice(cumulativeCount/votesCount);
            delete votesCount;
            delete cumulativeCount;
            for (uint i ; i < _numVoters ; unsafe_inc(i)){
                delete voterDidVote[voters[i]];
            }
        }
    }

    function checkIfOnGoingVote() external view returns(string memory){
        if (vote_state == VOTE_STATE.ONGOING){
            return "On-going vote.";
        } else {
            return "All votes settled.";
        }
    }

    // function consensusReached(uint256 numberOfUses) internal {
    //     uint256 i;

    // }

    // function _checkVoter(address account) internal view {
    //     return
    // }

    // function vote()

    function unsafe_inc(uint x) private pure returns (uint) {
        unchecked { return x + 1; }
    }

    function splitBalance() internal {
        uint256 tempLen = voters.length;
        uint256 splitAmount = address(this).balance/tempLen;
        for (uint i ; i<tempLen ; unsafe_inc(i)){
            (bool sent,) = voters[i].call{value:splitAmount}("");
            require(sent, "Failed to send ETH to voter");
        }
    }

    // function receivePayment(uint256 _amount) external payable {
    //     uint256 tempLen = voters.length;
    //     uint256 splitAmount = _amount/tempLen;
    //     for (uint i ; i<tempLen ; i++){
    //         (bool sent,) = payable(voters[i]).call{value:splitAmount}("");
    //         require(sent, "Failed to send ETH to voter");
    //     }
    // }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    receive() external payable {
        splitBalance();
    }
}
