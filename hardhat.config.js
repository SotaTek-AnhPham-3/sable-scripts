require("@nomicfoundation/hardhat-toolbox");

const accounts = require("./hardhatAccountsList2k.js");
const accountsList = accounts.accountsList;

const fs = require("fs");
const getSecret = (secretKey, defaultValue = "") => {
  const SECRETS_FILE = "./secrets.js";
  let secret = defaultValue;
  if (fs.existsSync(SECRETS_FILE)) {
    const { secrets } = require(SECRETS_FILE);
    if (secrets[secretKey]) {
      secret = secrets[secretKey];
    }
  }

  return secret;
};

const bscTestnetUrl = () => {
  return `https://data-seed-prebsc-2-s1.binance.org:8545`
}

const bscUrl = () => {
  return `https://bsc-dataseed1.binance.org/`
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      accounts: accountsList,
      gas: 10000000, // tx gas limit
      blockGasLimit: 15000000,
      gasPrice: 20000000000,
      initialBaseFeePerGas: 0,
      allowUnlimitedContractSize: true
    },
    bscTestnet: {
      url: bscTestnetUrl(),
      gas: 10000000,
      accounts: [getSecret('BSC_DEPLOYER_PRIVATEKEY', '0x60ddfe7f579ab6867cbe7a2dc03853dc141d7a4ab6dbefc0dae2d2b1bd4e487f')]
    },
    bsc: {
        url: bscUrl(),
        gas: 10000000,
        accounts: [getSecret('BSC_DEPLOYER_PRIVATEKEY', '0x60ddfe7f579ab6867cbe7a2dc03853dc141d7a4ab6dbefc0dae2d2b1bd4e487f')]
    },
  },
};
