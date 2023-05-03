import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC,
      accounts: [process.env.DEPLOYER_PRIV_KEY!],
    },
    polygon: {
      url: process.env.POLYGON_RPC,
      accounts: [process.env.DEPLOYER_PRIV_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};

export default config;
