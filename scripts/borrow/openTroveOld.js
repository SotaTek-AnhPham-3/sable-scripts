const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");

const abi = require("./../../abi/BorrowerOperationsOld.json");
const oracleAddresses = require("./../../constants/oracle.json");
const demoAddresses = require("./../../constants/setPrice.json");

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    const contractAddress = "0x19CC37785E3Eb0afF5214D87A42E9262CCFa8aC8";

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const maxFeePercentage = "1000000000000000000";
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    // change this
    const LUSD_amount = ethers.utils.parseEther("20");

    // change this
    const BNB_amount = ethers.utils.parseEther("0.02");
      
    let tx = await Contract.connect(signer).openTrove(
        maxFeePercentage,
        LUSD_amount,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        { value: BNB_amount }
    )

    await tx.wait();
    console.log("Open trove success");

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
npx hardhat run scripts/borrow/openTroveOld.js --network bscTestnet
*/