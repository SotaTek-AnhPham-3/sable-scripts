const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");

const abi = require("./../../abi/MockPyth.json");
const { addresses } = require("./../../constants");

const PRICE_ID = "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a";

const dec = (val, scale) => {
    let zerosCount;

    if (scale == "ether") {
      zerosCount = 18;
    } else if (scale == "finney") zerosCount = 15;
    else {
      zerosCount = scale;
    }

    const strVal = val.toString();
    const strZeros = "0".repeat(zerosCount);

    return strVal.concat(strZeros);
}

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    const contractAddress = addresses["MockPyth"]["setPrice"];
    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const MockPyth = new ethers.Contract(contractAddress, abi.abi, signer);

    const EXPO = -8;

    // change this line
    let mockPrice = 200; // 200 USD
    mockPrice = dec(mockPrice, 8);

    // change this line
    let deviationPyth = 0.2; // 0.2%
    let conf = BigInt(mockPrice);

    const currentBlock = await ethers.provider.getBlockNumber();
    const now = (await ethers.provider.getBlock(currentBlock)).timestamp; 

    let tx = await MockPyth.mockPrices(
      PRICE_ID, 
      BigInt(mockPrice), 
      BigInt(conf), 
      EXPO, 
      BigInt(mockPrice), 
      BigInt(conf), 
      BigInt(now)
    );

    await tx.wait();
    
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

/*
npx hardhat run scripts/priceFeed/pythMockPrice.js --network bscTestnet
*/