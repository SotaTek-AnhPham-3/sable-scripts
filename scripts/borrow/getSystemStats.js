const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");

const abi = require("./../../abi/BorrowerOperations.json");
const oracleAddresses = require("./../../constants/oracle.json");
const demoAddresses = require("./../../constants/setPrice.json");

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    let addresses = process.env["ENV"] == 'demo' ? demoAddresses : oracleAddresses;

    const contractAddress = addresses.addresses.borrowerOperations;

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const systemColl = await Contract.getEntireSystemColl();
    console.log("🚀 ~ file: getSystemStats.js:24 ~ main ~ systemColl:", Number(systemColl))

    const systemDebt = await Contract.getEntireSystemDebt();
    console.log("🚀 ~ file: getSystemStats.js:27 ~ main ~ systemDebt:", Number(systemDebt))
      
    const PRICE = 2000;
    const TCR = Number(systemColl) * Number(PRICE) / Number(systemDebt) * 100;
    console.log(`TCR: ${TCR}%`)

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/borrow/getSystemStats.js --network bscTestnet
*/