const { ethers } = require("hardhat");

const abi = require("./../../abi/PriceFeedTester.json");

async function main() {

    let rpc = "https://data-seed-prebsc-2-s2.binance.org:8545";
    let chainId = 97;

    // Change these constants
    const contractAddress = "0x9EB8a62E77Bb09fBDfcFb9E8EbF98550eE02DdE1";

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const PriceFeed = new ethers.Contract(contractAddress, abi.abi, signer);

    // change this
    const LAST_GOOD_PRICE = ethers.utils.parseEther("2000"); // 2000 USD
    let tx = await PriceFeed.connect(signer).setLastGoodPrice(LAST_GOOD_PRICE);
    await tx.wait();

    console.log("PriceFeed set last good price success");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*
npx hardhat run scripts/priceFeed/setLastGoodPrice.js --network bscTestnet
*/