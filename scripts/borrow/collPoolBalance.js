const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

const oracleAddresses = require("./../../constants/oracle.json");
const demoAddresses = require("./../../constants/setPrice.json");

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    let addresses = process.env["ENV"] == 'demo' ? demoAddresses : oracleAddresses;

    const contractAddress = addresses.addresses.collSurplusPool;

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);

    const balance = await provider.getBalance(contractAddress);
    console.log("BNB in Coll Pool: ", ethers.utils.formatEther(balance));

    const stabilityPoolAddress = addresses.addresses.stabilityPool;
    const spBalance = await provider.getBalance(stabilityPoolAddress);
    console.log("BNB in Stability Pool: ", ethers.utils.formatEther(spBalance));

    const activePoolAddress = addresses.addresses.activePool;
    const activeBalance = await provider.getBalance(activePoolAddress);
    console.log("BNB in Active Pool: ", ethers.utils.formatEther(activeBalance));

    const defaultPoolAddress = addresses.addresses.defaultPool;
    const defaultPoolBalance = await provider.getBalance(defaultPoolAddress);
    console.log("BNB in Default Pool: ", ethers.utils.formatEther(defaultPoolBalance));

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/borrow/collPoolBalance.js --network bscTestnet
*/