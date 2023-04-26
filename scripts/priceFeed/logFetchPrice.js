const { ethers } = require("hardhat");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");

const connection = new EvmPriceServiceConnection(
    "https://xc-testnet.pyth.network"
);
  
const priceIds = [
    "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a", // BNB/USD price id in testnet
];

const abi = require("./../../abi/PriceFeedTester.json");

async function main() {

    let rpc = "https://data-seed-prebsc-2-s2.binance.org:8545";
    let chainId = 97;

    // Change these constants
    const contractAddress = "0x9EB8a62E77Bb09fBDfcFb9E8EbF98550eE02DdE1";

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const PriceFeed = new ethers.Contract(contractAddress, abi.abi, signer);

    const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(priceIds);

    let tx = await PriceFeed.connect(signer).logPythFetchPriceResult(priceFeedUpdateData, { value: 1});
    await tx.wait();

    let fetchPriceResult = await PriceFeed.getInternalFetchPriceResult();
    console.log("price: ", Number(fetchPriceResult.price));
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
npx hardhat run scripts/priceFeed/logFetchPrice.js --network bscTestnet
*/