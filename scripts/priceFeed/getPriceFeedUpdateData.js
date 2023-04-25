const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");

async function main() {
    const connection = new EvmPriceServiceConnection(
        "https://xc-testnet.pyth.network"
    );
      
    const priceIds = [
        "0xecf553770d9b10965f8fb64771e93f5690a182edc32be4a3236e0caaa6e0581a", // BNB/USD price id in testnet
    ];
      
    const priceFeedUpdateData = await connection.getPriceFeedsUpdateData(priceIds);
    console.log("priceFeedUpdateData: ", priceFeedUpdateData);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

/*
npx hardhat run scripts/priceFeed/getPriceFeedUpdateData.js
*/