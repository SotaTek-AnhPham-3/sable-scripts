const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");

const abi = require("./../../abi/TimeLock.json");
const oracleAddresses = require("./../../constants/oracle.json");
const demoAddresses = require("./../../constants/setPrice.json");

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    let addresses = process.env["ENV"] == 'demo' ? demoAddresses : oracleAddresses;

    const contractAddress = addresses.addresses.timeLock;

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const systemStateAddress = addresses.addresses.systemState;
    const value = 0;
    const zeroBytes = defaultAbiCoder.encode(["uint"], [0]);
    const salt = defaultAbiCoder.encode(["uint"], [0]);

    // Variables to change
    const DELAY = 11;
    let NEW_BORROWING_FEE_FLOOR = "0.75"; // %

    // Do not change this line
    const iface = new Interface(["function setBorrowingFeeFloor(uint)"]);
    NEW_BORROWING_FEE_FLOOR = ethers.utils.parseEther(NEW_BORROWING_FEE_FLOOR).div(100)
    const DATA = iface.encodeFunctionData("setBorrowingFeeFloor", [NEW_BORROWING_FEE_FLOOR.toString()]);

    let tx = await Contract.connect(signer).execute(systemStateAddress, value, DATA, zeroBytes, salt);
    await tx.wait();

    console.log("Execute success!");

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/timeLock/borrowingFeeFloorExecute.js --network bscTestnet
ENV=oracle npx hardhat run scripts/timeLock/borrowingFeeFloorExecute.js --network bscTestnet
*/