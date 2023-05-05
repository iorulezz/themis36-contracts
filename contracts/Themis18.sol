// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Themis18 is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string private __baseURI = "";

    address private _accessTokenAddress;

    constructor(address accessTokenAddress) ERC721("Themis18", "T18") {
        _accessTokenAddress = accessTokenAddress;
    }

    function _baseURI() internal view override returns (string memory) {
        return __baseURI;
    }

    // since there is only 2 access tokens there will only be two tokens for this contract as well
    function mintWithAccessToken(uint256 tokenId) external {
        ERC721Burnable accessToken = ERC721Burnable(_accessTokenAddress);
        require(
            tokenId == 0 || tokenId == 1,
            "Only tokens 0 and 1 can be minted with the access token."
        );
        require(
            accessToken.ownerOf(tokenId) == msg.sender,
            "Caller must own the required access token."
        );

        accessToken.burn(tokenId);
        _safeMint(msg.sender, tokenId);
    }

    function merge() external {
        require(balanceOf(msg.sender) >= 2, "Caller must hold tokens 0 and 1.");
        require(
            ownerOf(0) == msg.sender && ownerOf(1) == msg.sender,
            "Caller must hold tokens 0 and 1."
        );

        uint256 totalSupply = _tokenIdCounter.current();
        for (uint256 i = totalSupply; i < totalSupply + 5; i++) {
            _tokenIdCounter.increment();
            _safeMint(msg.sender, i);
        }
    }
}
