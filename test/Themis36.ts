import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Themis36", function () {
  async function deployContractsFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Themis36AccessToken = await ethers.getContractFactory(
      "Themis36AccessToken"
    );
    const accessToken = await Themis36AccessToken.deploy();
    await accessToken.safeMint(owner.address);
    await accessToken.safeMint(owner.address);

    const Themis18 = await ethers.getContractFactory("Themis18");
    const themis18 = await Themis18.deploy(accessToken.address);
    await accessToken.connect(owner).approve(themis18.address, 0);
    await accessToken.connect(owner).approve(themis18.address, 1);

    const Themis36 = await ethers.getContractFactory("Themis36");
    const themis36 = await Themis36.deploy(themis18.address);

    return { accessToken, themis18, themis36, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right token name and symbol", async function () {
      const { themis36 } = await loadFixture(deployContractsFixture);

      expect(await themis36.name()).to.equal("Themis36");
      expect(await themis36.symbol()).to.equal("T36");
    });
  });

  describe("Unlocking", function () {
    it("Should mint all tokens for the owner when unlocked", async function () {
      const { themis18, themis36, owner } = await loadFixture(
        deployContractsFixture
      );

      // Assume owner has both Themis18 tokens 0 and 1.
      await themis18.connect(owner).mintWithAccessToken(0);
      await themis18.connect(owner).mintWithAccessToken(1);

      await themis36.connect(owner).unlock();
      for (let i = 0; i < 5; i++) {
        expect(await themis36.ownerOf(i)).to.equal(owner.address);
      }
    });

    it("Should not allow unlocking without both Themis18 tokens", async function () {
      const { themis18, themis36, owner, otherAccount } = await loadFixture(
        deployContractsFixture
      );

      await themis18.connect(owner).mintWithAccessToken(0);
      await themis18.connect(owner).mintWithAccessToken(1);
      // send one token away to test this case
      await themis18
        .connect(owner)
        .transferFrom(owner.address, otherAccount.address, 1);

      await expect(themis36.unlock()).to.be.revertedWith(
        "Caller must own both Themis18 tokens to unlock."
      );
    });

    it("Should not allow unlocking twice", async function () {
      const { themis18, themis36, owner } = await loadFixture(
        deployContractsFixture
      );

      // Assume owner has both Themis18 tokens 0 and 1.
      await themis18.mintWithAccessToken(0);
      await themis18.mintWithAccessToken(1);

      await themis36.unlock();

      await expect(themis36.unlock()).to.be.revertedWith(
        "The collection has already been unlocked."
      );
    });
  });

  describe("Token URI", function () {
    it("Should return the correct token URI", async function () {
      const { themis18, themis36, owner } = await loadFixture(
        deployContractsFixture
      );

      await themis18.mintWithAccessToken(0);
      await themis18.mintWithAccessToken(1);
      await themis36.unlock();

      expect(await themis36.tokenURI(0)).to.equal(
        "ipfs://QmWBAB4Ky7CSHNJFhJjUF4L9HWCUbvGtyLrmQxSrXbAWZ6/0.json"
      );
    });

    it("Should revert if token does not exist", async function () {
      const { themis36 } = await loadFixture(deployContractsFixture);

      await expect(themis36.tokenURI(0)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
  });

  describe("Contract URI", function () {
    it("Should return the correct contract URI", async function () {
      const { themis36 } = await loadFixture(deployContractsFixture);
  
      expect(await themis36.contractURI()).to.equal(
        "ipfs://QmWBAB4Ky7CSHNJFhJjUF4L9HWCUbvGtyLrmQxSrXbAWZ6/contract.json"
      );
    });
  });
  
});
