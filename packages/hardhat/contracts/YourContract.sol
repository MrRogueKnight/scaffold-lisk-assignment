//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(address => bool) public hasMinted;
    string private _baseTokenURI;
    uint256 public constant MAX_SUPPLY = 10000; // Maximum number of NFTs that can be minted
    
    // Alias for MAX_SUPPLY for backward compatibility
    function maxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }

    // State Variables
    string public greeting = "Building Unstoppable Apps!!!";
    string public purpose = "To learn Scaffold-Lisk";
    bool public premium = false;
    uint256 public totalCounter = 0;
    mapping(address => uint) public userGreetingCounter;

	// Events: a way to emit log statements from smart contract that can be listened to by external parties
	event GreetingChange(
		address indexed greetingSetter,
		string newGreeting,
		bool premium,
		uint256 value
	);

	event PurposeChange(address indexed purposeSetter, string newPurpose);

    // Constructor: Called once on contract deployment
    // Check packages/hardhat/deploy/00_deploy_your_contract.ts
    constructor(address _owner, string memory baseTokenURI) ERC721("YourNFT", "YNFT") Ownable() {
        transferOwnership(_owner);
        _baseTokenURI = baseTokenURI;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    // (No longer needed; using Ownable from OpenZeppelin)


	    /**
     * Function that allows anyone to change the state variable "purpose" of the contract
     *
     * @param _newPurpose (string memory) - new purpose to save on the contract
     */
    function setPurpose(string memory _newPurpose) public {
    purpose = _newPurpose;
    console.log("Setting new purpose '%s' from %s", _newPurpose, msg.sender);
    emit PurposeChange(msg.sender, _newPurpose);
  }

    /**
     * @param _newGreeting (string memory) - new greeting to save on the contract
     */
    /**
     * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
     */
    function setGreeting(string memory _newGreeting) public payable {
		// Print data to the hardhat chain console. Remove when deploying to a live network.
		console.log(
			"Setting new greeting '%s' from %s",
			_newGreeting,
			msg.sender
		);

		// Change state variables
		greeting = _newGreeting;
		totalCounter += 1;
		userGreetingCounter[msg.sender] += 1;

		// msg.value: built-in global variable that represents the amount of ether sent with the transaction
		if (msg.value > 0) {
			premium = true;
		} else {
			premium = false;
		}

		// emit: keyword used to trigger an event
		emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, msg.value);
	}

    /**
     * Function that allows the owner to withdraw all the Ether in the contract
     */
    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    /**
     * NFT minting: Each address can mint one NFT. Token IDs are sequential. Emits Transfer event.
     */
    function mintNFT() public {
        require(!hasMinted[msg.sender], "Already minted");
        require(_tokenIdCounter.current() < maxSupply, "Max supply reached");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}
