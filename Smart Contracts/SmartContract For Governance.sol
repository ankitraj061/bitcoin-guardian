// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's SafeMath library
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Governance {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    uint256 public proposalCount; // Total number of proposals
    mapping(uint256 => Proposal) public proposals; // Mapping of proposal ID to Proposal
    mapping(uint256 => mapping(address => bool)) public votes; // Mapping of proposal ID to voter address to vote status

    // Proposal structure
    struct Proposal {
        address proposer;
        address contractAddress;
        bytes data;
        uint256 voteCount;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
    }

    // Events
    event ProposalCreated(uint256 proposalId, address proposer, address contractAddress, bytes data);
    event Voted(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 proposalId, address contractAddress, bytes data);

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
        proposalCount = 0;
    }

    // Function to propose a change to a contract
    function proposeChange(address contractAddress, bytes calldata data) external {
        require(contractAddress != address(0), "Invalid contract address");
        require(data.length > 0, "Invalid data");

        // Create new proposal
        proposals[proposalCount] = Proposal({
            proposer: msg.sender,
            contractAddress: contractAddress,
            data: data,
            voteCount: 0,
            startBlock: block.number,
            endBlock: block.number.add(5760), // Voting period of ~1 day (assuming 15s block time)
            executed: false
        });

        emit ProposalCreated(proposalCount, msg.sender, contractAddress, data);
        proposalCount++;
    }

    // Function to vote on a proposal
    function vote(uint256 proposalId, bool support) external {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        require(block.number >= proposal.startBlock && block.number <= proposal.endBlock, "Voting period is over");
        require(!votes[proposalId][msg.sender], "Already voted");

        // Update vote count
        if (support) {
            proposal.voteCount = proposal.voteCount.add(1);
        }

        // Mark voter as voted
        votes[proposalId][msg.sender] = true;

        emit Voted(proposalId, msg.sender, support);
    }

    // Function to execute a proposal
    function executeProposal(uint256 proposalId) external onlyAdmin {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        require(block.number > proposal.endBlock, "Voting period is not over");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.voteCount > proposalCount.div(2), "Proposal did not pass");

        // Execute the proposal
        (bool success, ) = proposal.contractAddress.call(proposal.data);
        require(success, "Proposal execution failed");

        // Mark proposal as executed
        proposal.executed = true;

        emit ProposalExecuted(proposalId, proposal.contractAddress, proposal.data);
    }
}