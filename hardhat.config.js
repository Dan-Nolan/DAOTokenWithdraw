require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_URL,
        blockNumber: 12998323
      }
    }
  }
};
