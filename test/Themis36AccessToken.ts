import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Themis36AccessToken", function () {
  async function deployAccessTokenFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Themis36AccessToken = await ethers.getContractFactory(
      "Themis36AccessToken"
    );
    const accessToken = await Themis36AccessToken.deploy();

    return { accessToken, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right token name and symbol", async function () {
      const { accessToken } = await loadFixture(deployAccessTokenFixture);

      expect(await accessToken.name()).to.equal("Themis36AccessToken");
      expect(await accessToken.symbol()).to.equal("T36AT");
    });
  });

  describe("Minting", function () {
    it("Should mint a token for the owner", async function () {
      const { accessToken, owner } = await loadFixture(
        deployAccessTokenFixture
      );

      await accessToken.safeMint(owner.address);
      expect(await accessToken.ownerOf(0)).to.equal(owner.address);
    });

    it("Should not allow minting more than 2 tokens", async function () {
      const { accessToken, owner } = await loadFixture(
        deployAccessTokenFixture
      );

      await accessToken.safeMint(owner.address);
      await accessToken.safeMint(owner.address);
      await expect(accessToken.safeMint(owner.address)).to.be.revertedWith(
        "Cannot mint more than 2 access tokens."
      );
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const { accessToken, otherAccount } = await loadFixture(
        deployAccessTokenFixture
      );

      await expect(
        accessToken.connect(otherAccount).safeMint(otherAccount.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Token URI", function () {
    it("Should return the correct base URI", async function () {
      const { accessToken, owner } = await loadFixture(
        deployAccessTokenFixture
      );

      const newBaseURI = "https://example.com/metadata/";
      await accessToken.setURI(newBaseURI);
      await accessToken.safeMint(owner.address);
      expect(await accessToken.tokenURI(0)).to.equal(newBaseURI);
    });

    it("Should revert if token does not exist", async function () {
      const { accessToken } = await loadFixture(deployAccessTokenFixture);

      await expect(accessToken.tokenURI(0)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
  });

  describe("Transfer", function () {
    it("Should not allow transferring tokens", async function () {
      const { accessToken, owner, otherAccount } = await loadFixture(
        deployAccessTokenFixture
      );

      await accessToken.safeMint(owner.address);
      await expect(
        accessToken.transferFrom(owner.address, otherAccount.address, 0)
      ).to.be.revertedWith("Token not transferable");
    });
  });

  describe("Burning", function () {
    it("Should allow burning tokens", async function () {
      const { accessToken, owner } = await loadFixture(
        deployAccessTokenFixture
      );

      await accessToken.safeMint(owner.address);
      await accessToken.burn(0);
      await expect(accessToken.ownerOf(0)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Should revert if trying to burn non-owned token", async function () {
      const { accessToken, owner, otherAccount } = await loadFixture(
        deployAccessTokenFixture
      );

      await accessToken.safeMint(owner.address);
      await expect(
        accessToken.connect(otherAccount).burn(0)
      ).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });
  });
});
