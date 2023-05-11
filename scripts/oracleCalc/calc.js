async function main() {
    const ONE = 1e18;
    const DECIMAL_PRECISION = 1e14;
    const MAX_ORACLE_RATE_PERCENTAGE = 25e14;

    const deviationPyth = 5761165830297;
    const publishTimePyth = 1683794362;
    const blockTimestamp = 1683794373;

    let absDelayTime = blockTimestamp > publishTimePyth 
        ? blockTimestamp - publishTimePyth
        : publishTimePyth - blockTimestamp;
    
    let oracleRate = deviationPyth + absDelayTime * DECIMAL_PRECISION;
    if (oracleRate > MAX_ORACLE_RATE_PERCENTAGE) {
        oracleRate = MAX_ORACLE_RATE_PERCENTAGE;
    }

    console.log("oracle rate: ", oracleRate);
    console.log(`Oracle rate: ${oracleRate / ONE * 100}%`)

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

/*
npx hardhat run scripts/oracleCalc/calc.js
*/