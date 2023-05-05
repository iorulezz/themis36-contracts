// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Themis36AccessToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Themis18 is ERC721 {
    address private _accessTokenAddress;

    constructor(address accessTokenAddress) ERC721("Themis18", "T18") {
        _accessTokenAddress = accessTokenAddress;
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
    function mintWithAccessToken(uint256 accessTokenId) external {
        require(
            accessTokenId < 2,
            "Only tokens 0 and 1 can be minted with the access token."
        );

        Themis36AccessToken accessToken = Themis36AccessToken(
            _accessTokenAddress
        );

        require(
            accessToken.ownerOf(accessTokenId) == msg.sender,
            "Caller must own the required access token."
        );

        require(
            accessToken.getApproved(accessTokenId) == address(this),
            "The access token has not been approved and cannot be burnt."
        );

        accessToken.burn(accessTokenId);
        _safeMint(msg.sender, accessTokenId);
    }
}
