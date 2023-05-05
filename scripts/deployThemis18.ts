import { ethers } from "hardhat";

async function main() {
  const T18 = await ethers.getContractFactory("Themis18");
  const t18 = await T18.deploy("0x32E9E4859CA4d6f06868F370A14ba77475E2d2f9");
  await t18.deployed();

  console.log(`Themis18 deployed to ${t18.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
