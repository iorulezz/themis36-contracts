// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Themis36AccessToken is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string private __baseURI = "";

    constructor() ERC721("Themis36AccessToken", "T36AT") {}

    function _baseURI() internal view override returns (string memory) {
        return __baseURI;
    }

    // Token not transferable
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721)
    {
        if (to != address(0)){
            require(from == address(0), "Token not transferable");
        }
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // updateable metadata
    function setURI(string calldata uri) external {
        __baseURI = uri;
    }

    function safeMint(address to) external onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        // only two whitelist tokens allowed
        require(tokenId < 2, "Cannot mint more than 2 access tokens.");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        _requireMinted(tokenId);
        return _baseURI();
    }
}
