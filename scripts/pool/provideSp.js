const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");

const abi = require("./../../abi/StabilityPool.json");
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

    const contractAddress = addresses.addresses.stabilityPool;

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("ae463aeae93f7a416bfb2b9d0e3abf05fd2f983c2d214bd106ce03be87fcf397", provider);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    // change this
    const LUSD_amount = ethers.utils.parseEther("5");

    // change this
    const feTag = "0x843B9a2cAF747260116059DE1aB8bA41d05ec8f1";
      
    let tx = await Contract.connect(signer).provideToSP(
        LUSD_amount,
        feTag
    )

    await tx.wait();
    console.log("Provide to SP success");

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/pool/provideSp.js --network bscTestnet
ENV=oracle npx hardhat run scripts/pool/provideSp.js --network bscTestnet
*/