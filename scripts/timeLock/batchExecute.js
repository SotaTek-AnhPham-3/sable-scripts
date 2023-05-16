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
    const signer = new ethers.Wallet("4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7", provider);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const systemStateAddress = addresses.addresses.systemState;
    const value = 0;
    const zeroBytes = defaultAbiCoder.encode(["uint"], [0]);
    const salt = defaultAbiCoder.encode(["uint"], [20]);

    // Variables to change
    let NEW_BORROWING_FEE_FLOOR = "0.05"; // %

    // Do not change this line
    let iface = new Interface(["function setBorrowingFeeFloor(uint)"]);
    NEW_BORROWING_FEE_FLOOR = ethers.utils.parseEther(NEW_BORROWING_FEE_FLOOR).div(100)
    const DATA1 = iface.encodeFunctionData("setBorrowingFeeFloor", [NEW_BORROWING_FEE_FLOOR.toString()]);
    let NEW_REDEMPTION_FEE_FLOOR = "0.75"; // %

    // Do not change this line
    iface = new Interface(["function setRedemptionFeeFloor(uint)"]);
    NEW_REDEMPTION_FEE_FLOOR = ethers.utils.parseEther(NEW_REDEMPTION_FEE_FLOOR).div(100)
    const DATA2 = iface.encodeFunctionData("setRedemptionFeeFloor", [NEW_REDEMPTION_FEE_FLOOR.toString()]);

    const DATA = [DATA1, DATA2];
    const targets = [systemStateAddress, systemStateAddress];
    let tx = await Contract.connect(signer).executeBatch(targets, [0, 0], DATA, zeroBytes, salt);
    await tx.wait();

    console.log("Batch schedule success!");

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/timeLock/batchExecute.js --network bscTestnet
ENV=oracle npx hardhat run scripts/timeLock/batchExecute.js --network bscTestnet
*/