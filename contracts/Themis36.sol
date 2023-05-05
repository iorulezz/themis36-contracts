// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Themis36 is ERC721 {
    address private _themis18Address;
    bool private _unlocked;

    constructor(address themis18Address) ERC721("Themis36", "T36") {
        _themis18Address = themis18Address;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmWBAB4Ky7CSHNJFhJjUF4L9HWCUbvGtyLrmQxSrXbAWZ6/";
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(_tokenId);
        return string.concat(_baseURI(), Strings.toString(_tokenId), ".json");
    }

    function contractURI() public pure returns (string memory) {
        return string.concat(_baseURI(), "contract.json");
    }

    // since there is only 2 access tokens there will only be two tokens for this contract as well
    function unlock() external {
        require(!_unlocked, "The collection has already been unlocked.");
        ERC721 themis18 = ERC721(_themis18Address);

        require(
            themis18.ownerOf(0) == msg.sender &&
                themis18.ownerOf(1) == msg.sender,
            "Caller must own both Themis18 tokens to unlock."
        );

        for (uint i = 0; i < 5; i++) {
            _safeMint(msg.sender, i);
        }

        _unlocked = true;
    }
}
