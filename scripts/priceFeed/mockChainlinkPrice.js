const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");

const abi = require("./../../abi/MockAggregator.json");
const { addresses } = require("./../../constants");

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    const contractAddress = addresses["MockChainlink"]["setPrice"];
    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const MockChainlink = new ethers.Contract(contractAddress, abi.abi, signer);

    // let mockPrice = 

}