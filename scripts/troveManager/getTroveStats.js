const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");

const abi = require("./../../abi/TroveManager.json");
const lusdAbi = require("./../../abi/LUSDToken.json");
const oracleAddresses = require("./../../constants/oracle.json");
const demoAddresses = require("./../../constants/setPrice.json");

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    let addresses = process.env["ENV"] == 'demo' ? demoAddresses : oracleAddresses;

    const contractAddress = addresses.addresses.troveManager;
    const lusdAddress = addresses.addresses.lusdToken;

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const userAddress = "0xe8d13eebaa469d86b4d3f1a18b5363b7e07e2c3b"

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const LUSDContract = new ethers.Contract(lusdAddress, lusdAbi.abi, signer);

    const troveColl = await Contract.getTroveColl(userAddress);
    console.log("troveColl:", ethers.utils.formatEther(troveColl))

    let troveDebt = await Contract.getTroveDebt(userAddress);

    console.log("troveDebt:", ethers.utils.formatEther(troveDebt))

    const lusdBalance = await LUSDContract.balanceOf(userAddress);
    console.log("LUSD balance: ", ethers.utils.formatEther(lusdBalance))
      
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/troveManager/getTroveStats.js --network bscTestnet
*/