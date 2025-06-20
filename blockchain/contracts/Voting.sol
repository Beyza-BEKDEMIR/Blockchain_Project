pragma solidity ^0.8.29;

contract Voting {
    struct Voter {
        address addr;
        bool hasVoted;
    }

    struct Candidate {
        string name;
        uint64 voteCount;
    }

    Voter[] public voters;
    mapping(address => bool) public isVoter;
    Candidate[] public candidates;
    address public owner;
    bool public votingOpen = true;

    event VoteCast(address indexed voter, uint8 candidateIndex);
    event VotingEnded();

    constructor(address[5] memory voterAddresses) {
        owner = msg.sender;
        for (uint i = 0; i < voterAddresses.length; i++) {
            voters.push(Voter(voterAddresses[i], false));
            isVoter[voterAddresses[i]] = true;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sadece sahibi yapabilir");
        _;
    }

    function addCandidate(string memory name) public onlyOwner {
        candidates.push(Candidate(name, 0));
    }

    function vote(uint8 candidateIndex) public {
        require(votingOpen, "Oylama kapali");
        require(isVoter[msg.sender], "Oy kullanma yetkiniz yok");
        require(candidateIndex < candidates.length, "Gecersiz aday");

        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].addr == msg.sender) {
                require(!voters[i].hasVoted, "Zaten oy kullandiniz");
                voters[i].hasVoted = true;
                candidates[candidateIndex].voteCount++;

                emit VoteCast(msg.sender, candidateIndex);
                return;
            }
        }
    }

    function getResults() public view returns (Candidate[] memory) {
        return candidates;
    }

    function endVoting() public onlyOwner {
        votingOpen = false;
        emit VotingEnded();
    }
}
