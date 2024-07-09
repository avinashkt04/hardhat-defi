const { getNamedAccounts, ethers } = require("hardhat")
const {getWeth, AMOUNT} = require("../scripts/getWeth")

async function main() {
    // the protocol treats everything as ERC20 token
    await getWeth()
    const {deployer} = await getNamedAccounts()

    // Lending pool address provider: 0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e
    const lendingPool = await getLendingPool(deployer)
    console.log(`Lending Pool address: ${lendingPool.target}`)

    // deposit
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    // approve
    await approveErc20(wethTokenAddress, lendingPool.target, AMOUNT, deployer)
    console.log("Depositing...")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited")

    // Borrow
    let {availableBorrowsETH, totalDebtETH} = await getBorrowedUserData(lendingPool, deployer)
    const diaPrice = await getDaiPrice()
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / Number(diaPrice))
    console.log(`You can borrow ${amountDaiToBorrow} DAI`)
    const amountDaiToBorrowWei = ethers.parseEther(amountDaiToBorrow.toString())
    const daiTokenAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"
    await borrowDai(daiTokenAddress, lendingPool, amountDaiToBorrowWei, deployer)
    await getBorrowedUserData(lendingPool, deployer)
    await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
    await getBorrowedUserData(lendingPool, deployer)
}

async function repay(amount, daiAddress, lendingPool, account){
    await approveErc20(daiAddress, lendingPool.target, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, 2, account)
    await repayTx.wait(1)
    console.log("You've repaid!")
}

async function borrowDai(
    daiAddress,
    lendingPool,
    amountDaiToBorrow,
    account
){
    const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow, 2, 0, account)
    await borrowTx.wait(1)
    console.log("You've borrowed!")
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt("AggregatorV3Interface", "0x773616E4d11A78F511299002da57A0a94577F1f4")
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The DIA/ETH price is ${price}`)
    return price
}

async function getBorrowedUserData(lendingPool, account) {
    const {totalCollateralETH, totalDebtETH, availableBorrowsETH} = await lendingPool.getUserAccountData(account)
    console.log(`You have ${totalCollateralETH} worth of ETH deposited`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`)
    return {availableBorrowsETH, totalDebtETH}
}

async function getLendingPool(account) {
    
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        'ILendingPoolAddressesProvider',
        '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
        await ethers.getSigner(account)
    )
    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, await ethers.getSigner(account))
    return lendingPool
}

async function approveErc20(erc20Address, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20Token", erc20Address, await ethers.getSigner(account))
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log(`Approved ${amountToSpend} of ${erc20Address} to ${spenderAddress}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })