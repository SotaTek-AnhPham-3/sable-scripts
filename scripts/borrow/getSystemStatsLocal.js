const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");

const abi = require("./../../abi/BorrowerOperations.json");

async function main() {
    let rpc = "http://localhost:8545";
    let chainId = 17;

    const contractAddress = "0x9CF8C0ED50D930EcD1b77Cd8B31957FEaBFDAB8d"

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("0x60ddFE7f579aB6867cbE7A2Dc03853dC141d7A4aB6DBEFc0Dae2d2B1Bd4e487F", provider);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const systemColl = await Contract.getEntireSystemColl();
    console.log("systemColl:", ethers.utils.formatUnits(systemColl))

    const systemDebt = await Contract.getEntireSystemDebt();
    console.log("systemDebt:", ethers.utils.formatUnits(systemDebt))
      
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
npx hardhat run scripts/borrow/getSystemStatsLocal.js --network hardhat
*/