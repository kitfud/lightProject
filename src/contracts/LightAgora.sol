//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ILightFactory.sol";
import "./LightFactory.sol";
import "./ILightAgora.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


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

    constructor(uint256 initialSupply, address _priceFeedAddress) ERC20('LiquidLight', 'LIQ'){
        // _mint(msg.sender, initialSupply);
// very simple behavior: mint tokens when a new generator is minted/deployed,
//                       a fixed supply for that specific generator
//                       when a user buys a product, the gen can send tokens
//                       once tokens are all out, the generator gets the right to burn tokens?

        lightFactory = new LightFactory(address(this), _priceFeedAddress);
        factoryAddress = address(lightFactory);
        canMint[factoryAddress] = true;

        voters = [
            msg.sender,
            0xa97e80DF47220afaD2D017a10b023B55FDB86293,
            0x8BDD43Eb657847d2dC730eb45e1288eb3f588A04,
            0xa65AA8747Fa0934d51315082336938696E80136E,
            0x9466b7430eC51c81e1F43dDCf69278878B559382
        ];
        uint256 _numVoters = voters.length;
        for (uint i ; i<_numVoters ; unsafe_inc(i)) {
            isVoter[voters[i]] = true;
            _mint(voters[i], initialSupply);
        }
        vote_state = VOTE_STATE.SETTLED;
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
        require(canBurn[msg.sender] == true, "No burning rights");
        _;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    // // could remove - check
    // function addFactory(address _factoryAddress) external onlyVoter {
    //     factoryAddress = _factoryAddress;
    //     canMint[factoryAddress] = true;
    // }

    function mintTokens(address generatorAddress) external onlyMinter {
        _mint(generatorAddress, 1000);
    }

    // Check burn in ERC20Burtnable.sol github - burn function and burnFrom
    function burnTokens(address account, uint256 amount) external onlyBurner {
        _burn(account, amount);
    }

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
