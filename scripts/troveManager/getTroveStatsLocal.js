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
    const signer = new ethers.Wallet("0x60ddFE7f579aB6867cbE7A2Dc03853dC141d7A4aB6DBEFc0Dae2d2B1Bd4e487F", provider);

    const userAddress = "0xeB0C2735F972F96F271b0a71d7FB18BaafE60Ac6"

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
npx hardhat run scripts/troveManager/getTroveStatsLocal.js --network hardhat
*/