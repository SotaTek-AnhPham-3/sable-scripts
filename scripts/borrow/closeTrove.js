const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");

const abi = require("./../../abi/BorrowerOperations.json");
const oracleAddresses = require("./../../constants/oracle.json");
const demoAddresses = require("./../../constants/setPrice.json");

const connection = new EvmPriceServiceConnection(
    "https://xc-testnet.pyth.network"
);
  
const priceIds = [
    "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a", // BNB/USD price id in testnet
];

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    let addresses = process.env["ENV"] == 'demo' ? demoAddresses : oracleAddresses;

    const contractAddress = addresses.addresses.borrowerOperations;

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(priceIds);

    let tx = await Contract.connect(signer).closeTrove(priceFeedUpdateData);

    await tx.wait();
    console.log("Close trove success");

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/borrow/closeTrove.js --network bscTestnet
*/