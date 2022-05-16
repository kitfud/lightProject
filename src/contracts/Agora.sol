//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ILightFactory.sol";
import "./IAgora.sol";

// TO DO: Add the ERC20 token mechanics here? Add roles?

contract Agora is IAgora {
    // bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    address public factoryAddress; // could change this to a container but not needed now.

    uint256 votesCount;
    uint256 cumulativeCount;
    address[] public voters;
    mapping(address => bool) public isVoter;
    mapping(address => bool) public voterDidVote;
    // mapping(address => bool) public voterDidAgree; // no need for now
    // mapping(address => uint256) public voterToNewPrice; // no need for now

    enum VOTE_STATE {
        ONGOING,
        SETTLED
    }
    VOTE_STATE public vote_state;

    constructor() {
        // voters = [
        //     msg.sender,
        //     0xa97e80DF47220afaD2D017a10b023B55FDB86293,
        //     0x8BDD43Eb657847d2dC730eb45e1288eb3f588A04,
        //     0xa65AA8747Fa0934d51315082336938696E80136E,
        //     0x9466b7430eC51c81e1F43dDCf69278878B559382
        // ];

        for (uint i ; i< voters.length ; i++) {
            isVoter[voters[i]] = true;
        }
        vote_state = VOTE_STATE.SETTLED;
    }

    modifier onlyVoter {
        require(isVoter[msg.sender] == true, "you are not a voter");
        _;
    }

    function addFactory(address _factoryAddress) external onlyVoter {
        factoryAddress = _factoryAddress;
    }

    function suggestNFTPriceChange(uint256 _newPrice) public onlyVoter {
        if (vote_state == VOTE_STATE.SETTLED){
            vote_state = VOTE_STATE.ONGOING;
        }
        require(voterDidVote[msg.sender] == false, "you already voted");
        voterDidVote[msg.sender] = true;
        votesCount ++;
        cumulativeCount += _newPrice;
        if (votesCount == voters.length) {
            vote_state = VOTE_STATE.SETTLED;
            ILightFactory(factoryAddress).setNFTPrice(cumulativeCount/votesCount);
            delete votesCount;
            delete cumulativeCount;
            for (uint i ; i<voters.length ; i++){
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

    function splitBalance() internal {
        uint256 tempLen = voters.length;
        uint256 splitAmount = address(this).balance/tempLen;
        for (uint i ; i<tempLen ; i++){
            (bool sent,) = voters[i].call{value:splitAmount}("");
            require(sent, "Failed to send ETH to voter");
        }
    }

    function receivePayment(uint256 _amount) external payable {
        uint256 tempLen = voters.length;
        uint256 splitAmount = _amount/tempLen;
        for (uint i ; i<tempLen ; i++){
            (bool sent,) = payable(voters[i]).call{value:splitAmount}("");
            require(sent, "Failed to send ETH to voter");
        }
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    receive() external payable {
        splitBalance();
    }
}
