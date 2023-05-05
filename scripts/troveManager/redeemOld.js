const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");

const abi = require("./../../abi/TroveManager.json");
const oracleAddresses = require("./../../constants/oracle.json");
const demoAddresses = require("./../../constants/setPrice.json");

const priceFeedAbi = require("../../abi/PriceFeedOld.json");
const hintHelperAbi = require("../../abi/HintHelpers.json");
const sortedTrovesAbi = require("../../abi/SortedTroves.json");

async function main() {
    let rpc = "https://data-seed-prebsc-2-s1.binance.org:8545";
    let chainId = 97;

    let addresses = process.env["ENV"] == 'demo' ? demoAddresses : oracleAddresses;

    const contractAddress = "0x219297dab4146a841EC926A71092a4688cf492Ba";

    const hintHelperAddress = "0x7845A05313f75488D4DBF10361789AbCbbf8710C";
    const sortedTrovesAddress = "0xA601D7971282b8B6eCbE3fFf701cE093EbFa9E1C";
    const priceFeedAddress = "0x64E16f86A3948F2537f16c28347fB25cB7d4dbc5";

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet("8b5a09b55c9b838a8f5070b3540b2d15d748a5884594a0d729eb5ad36a09bffd", provider);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const PriceFeed = new ethers.Contract(priceFeedAddress, priceFeedAbi.abi, signer);
    const HintHelpers = new ethers.Contract(hintHelperAddress, hintHelperAbi.abi, signer);
    const SortedTroves = new ethers.Contract(sortedTrovesAddress, sortedTrovesAbi.abi, signer);

    const maxFeePercentage = "1000000000000000000";

    // change this
    const LUSD_amount = ethers.utils.parseEther("5");

    const price = await PriceFeed.lastGoodPrice();

    let maxIterations = 0;
    const { firstRedemptionHint, partialRedemptionHintNICR, truncatedLUSDamount } = await HintHelpers.getRedemptionHints(LUSD_amount, price, maxIterations);

    const { 0: upperPartialRedemptionHint, 1: lowerPartialRedemptionHint } = await SortedTroves.findInsertPosition(
        partialRedemptionHintNICR,
        signer.address,
        signer.address
    )

    const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(priceIds);

    let tx = await Contract.connect(signer).redeemCollateral(
        LUSD_amount,
        firstRedemptionHint,
        upperPartialRedemptionHint,
        lowerPartialRedemptionHint,
        partialRedemptionHintNICR,
        maxIterations,
        maxFeePercentage
    )

    await tx.wait();
    
    console.log("Redeem success");

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
  
/*
ENV=demo npx hardhat run scripts/troveManager/redeemOld.js --network bscTestnet
ENV=oracle npx hardhat run scripts/troveManager/redeemOld.js --network bscTestnet
*/