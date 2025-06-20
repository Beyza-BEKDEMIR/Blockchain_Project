require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.29",
  networks: {
    sepolia: {
      url: "",  //Buraya sepolia url si eklenecek.
      accounts: {
        mnemonic: "" //Buraya 12 kelimelik mnemonic eklenecek.
        }
    }
  }
};
