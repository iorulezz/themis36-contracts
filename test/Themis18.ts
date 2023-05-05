import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Themis18", function () {
  async function deployContractsFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Themis36AccessToken = await ethers.getContractFactory(
      "Themis36AccessToken"
    );
    const accessToken = await Themis36AccessToken.deploy();

    const Themis18 = await ethers.getContractFactory("Themis18");
    const themis18 = await Themis18.deploy(accessToken.address);

    return { themis18, accessToken, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right token name and symbol", async function () {
      const { themis18 } = await loadFixture(deployContractsFixture);

      expect(await themis18.name()).to.equal("Themis18");
      expect(await themis18.symbol()).to.equal("T18");
    });
  });

  describe("Minting", function () {
    it("Should mint a token for the owner with access token", async function () {
      const { themis18, accessToken, owner } = await loadFixture(
        deployContractsFixture
      );

      await accessToken.safeMint(owner.address);
      expect(await accessToken.ownerOf(0)).to.equal(owner.address);
      await accessToken.connect(owner).approve(themis18.address, 0);
      await themis18.connect(owner).mintWithAccessToken(0);
      expect(await themis18.ownerOf(0)).to.equal(owner.address);
    });

    it("Should mint both tokens with access tokens", async function () {
        const { themis18, accessToken, owner } = await loadFixture(
          deployContractsFixture
        );
      
        // Mint and use access token 0
        await accessToken.safeMint(owner.address);
        await accessToken.connect(owner).approve(themis18.address, 0);
        await themis18.connect(owner).mintWithAccessToken(0);
        expect(await themis18.ownerOf(0)).to.equal(owner.address);
      
        // Mint and use access token 1
        await accessToken.safeMint(owner.address);
        await accessToken.connect(owner).approve(themis18.address, 1);
        await themis18.connect(owner).mintWithAccessToken(1);
        expect(await themis18.ownerOf(1)).to.equal(owner.address);
      });
      

    it("Should not allow minting with an invalid access token", async function () {
      const { themis18, owner } = await loadFixture(deployContractsFixture);

      await expect(themis18.mintWithAccessToken(3)).to.be.revertedWith(
        "Only tokens 0 and 1 can be minted with the access token."
      );
    });

    it("Should not allow minting if the owner doesn't have the access token", async function () {
      const { themis18, otherAccount } = await loadFixture(
        deployContractsFixture
      );

      await expect(
        themis18.connect(otherAccount).mintWithAccessToken(0)
      ).to.be.revertedWith("Caller must own the required access token.");
    });

    it("Should not allow minting if the caller doesn't own the required access token", async function () {
        const { themis18, accessToken, owner, otherAccount } = await loadFixture(
          deployContractsFixture
        );
      
        await accessToken.safeMint(owner.address);
        await accessToken.connect(owner).approve(themis18.address, 0);
      
        await expect(
          themis18.connect(otherAccount).mintWithAccessToken(0)
        ).to.be.revertedWith("Caller must own the required access token.");
      });

      it("Should not allow minting if the required access token hasn't been approved", async function () {
        const { themis18, accessToken, owner } = await loadFixture(
          deployContractsFixture
        );
      
        await accessToken.safeMint(owner.address);
      
        await expect(
          themis18.connect(owner).mintWithAccessToken(0)
        ).to.be.revertedWith("The access token has not been approved and cannot be burnt.");
      });
      
      
  });

  describe("Token URI", function () {
    it("Should return the correct token URI", async function () {
      const { themis18, accessToken, owner } = await loadFixture(
        deployContractsFixture
      );

      await accessToken.safeMint(owner.address);
      await accessToken.connect(owner).approve(themis18.address, 0);
      await themis18.mintWithAccessToken(0);
      expect(await themis18.tokenURI(0)).to.equal(
        "ipfs://QmWBAB4Ky7CSHNJFhJjUF4L9HWCUbvGtyLrmQxSrXbAWZ6/0.json"
      );
    });

    it("Should revert if token does not exist", async function () {
      const { themis18 } = await loadFixture(deployContractsFixture);

      await expect(themis18.tokenURI(0)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
  });

  describe("Contract URI", function () {
    it("Should return the correct contract URI", async function () {
      const { themis18 } = await loadFixture(deployContractsFixture);

      expect(await themis18.contractURI()).to.equal(
        "ipfs://QmWBAB4Ky7CSHNJFhJjUF4L9HWCUbvGtyLrmQxSrXbAWZ6/contract.json"
      );
    });
  });
});
