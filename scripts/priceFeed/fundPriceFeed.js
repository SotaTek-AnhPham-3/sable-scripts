const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");

const oracleAddresses = require("./../../constants/oracle.json");
const demoAddresses = require("./../../constants/setPrice.json");

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    let addresses = process.env["ENV"] == 'demo' ? demoAddresses : oracleAddresses;

    const contractAddress = addresses.addresses.priceFeed;

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const tx = {
        to: contractAddress,
        value: ethers.utils.parseEther("0.001"),
    }

    const balanceBefore = await provider.getBalance(contractAddress);
    console.log("balanceBefore:", Number(balanceBefore))

    const transation = await signer.sendTransaction(tx);

    console.log("Funding success!");

    const balanceAfter = await provider.getBalance(contractAddress);
    console.log("balanceAfter:", Number(balanceAfter))

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/priceFeed/fundPriceFeed.js --network bscTestnet
*/