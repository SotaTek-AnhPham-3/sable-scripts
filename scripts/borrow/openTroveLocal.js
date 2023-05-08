const { Wallet, BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { defaultAbiCoder, Interface } = require("@ethersproject/abi");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");
const { SignerWithAddress } = require("@nomiclabs/hardhat-ethers/dist/src/signer-with-address");

const abi = require("./../../abi/BorrowerOperations.json");

const connection = new EvmPriceServiceConnection(
    "https://xc-testnet.pyth.network"
);
  
const priceIds = [
    "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a", // BNB/USD price id in testnet
];

async function main() {
    let rpc = "http://localhost:8545";
    let chainId = 17;
    const signers = await ethers.getSigners();
    const signer = signers[0];

    const contractAddress = "0x9CF8C0ED50D930EcD1b77Cd8B31957FEaBFDAB8d";

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);

    const Contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const maxFeePercentage = "1000000000000000000";
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    // change this
    const LUSD_amount = ethers.utils.parseEther("15");

    // change this
    const BNB_amount = ethers.utils.parseEther("1");
      
    const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(priceIds);

    const bnbBalance = await ethers.provider.getBalance(signer.address);
    console.log("Signer balance: ", bnbBalance);

    let anotherSigner = new ethers.Wallet("0x60ddFE7f579aB6867cbE7A2Dc03853dC141d7A4aB6DBEFc0Dae2d2B1Bd4e487F", provider);
    let anotherBalance = await ethers.provider.getBalance(anotherSigner.address);
    console.log("🚀 ~ file: openTroveLocal.js:49 ~ main ~ anotherBalance:", anotherBalance)

    let tx = await Contract.connect(signer).openTrove(
        maxFeePercentage,
        LUSD_amount,
        ZERO_ADDRESS,
        ZERO_ADDRESS,
        priceFeedUpdateData,
        { value: BNB_amount }
    )

    await tx.wait();
    console.log("Open trove success");

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
npx hardhat run scripts/borrow/openTroveLocal.js --network hardhat
*/