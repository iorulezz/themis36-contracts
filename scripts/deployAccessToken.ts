import { ethers } from "hardhat";

async function main() {
  const AT = await ethers.getContractFactory("Themis36AccessToken");
  const at = await AT.deploy();
  await at.deployed();

  console.log(`Themis36AccessToken deployed to ${at.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
