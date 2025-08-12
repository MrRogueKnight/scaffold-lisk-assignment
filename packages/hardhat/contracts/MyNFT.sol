// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseTokenURI;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant PRICE = 0.01 ether;
    uint256 public constant MAX_PER_MINT = 10;

    constructor() ERC721("MyNFT", "MNFT") {
        baseTokenURI = "https://ipfs.io/ipfs/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < MAX_SUPPLY, "Max supply reached");
        
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function mintNFT(uint256 quantity) public payable {
        require(quantity > 0 && quantity <= MAX_PER_MINT, "Invalid mint amount");
        require(msg.value >= PRICE * quantity, "Insufficient payment");
        require(_tokenIdCounter.current() + quantity <= MAX_SUPPLY, "Exceeds max supply");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, string(abi.encodePacked(Strings.toString(tokenId), ".json")));
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseTokenURI = _newBaseURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
