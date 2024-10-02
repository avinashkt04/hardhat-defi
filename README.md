# Hardhat DeFi 
This project implements a decentralized finance (DeFi) protocol using Hardhat. It includes smart contracts for interacting with decentralized lending protocols such as Aave and handling token transactions using ERC20 standards. The structure of the project is modular, with separate files for interfaces, scripts, and organized directories for easy navigation.

## Project Structure
The repository is organized as follows:
- **contracts**:
    - **interfaces**:
        - `AggregatorV3Interface.sol` – Interface for interacting with Chainlink price feeds.
        - `IERC20.sol` – Standard ERC20 interface for token interactions.
        - `ILendingPool.sol` – Aave LendingPool interface for borrowing and lending functionality.
        - `IWeth.sol` – Interface for interacting with Wrapped Ether (WETH).

- **Scripts**:

    - `aaveBorrow.js` – Script to borrow assets using the Aave lending protocol.
    - `getWeth.js` – Script to obtain WETH (wrapped Ether) to facilitate interactions with DeFi protocols.


## Prerequisites

Before you get started, make sure you have the following:
- **Yarn**: Package manager for managing dependencies and running scripts.
- **Node.js**: Version 18 or higher.

## Cloning

To clone this repository to your local machine, go to the location and run the following command in terminal:

```bash
git clone https://github.com/avinashkt04/hardhat-defi.git
```

## Getting Started

### Contract Deployment

1. **Install Dependencies:**
    
    ```bash
    yarn install
    ```
2. **Deploy Contract:**

    ```bash
    hh deploy
    ```

    Or, to deploy the contract to a specific network (e.g., Sepolia):

    ```bash
    hh deploy --network sepolia
    ```

## Testing Contracts
To run the tests defined in the `test` directory, use the following command:

```bash
hh test
```

## Running Scripts
To run any script in the `scripts` directory (e.g., a script named `aaveBorrow.js`), use:
```bash
hh run scripts/aaveBorrow.js
```
Or, to run a script on a specific network:
```bash
hh run scripts/aaveBorrow.js --network sepolia
```

## Configuration for Testnets
Before deploying or testing on a testnet like Sepolia, create a `.env` file in the `contract` directory with the following content:
```dotenv
SEPOLIA_RPC_URL=<sepolia_rpc_url>
PRIVATE_KEY=<your_wallet_private_key>
ETHERSCAN_API_KEY=<your_etherscan_api_key>
```
Replace  <sepolia_rpc_url>, <your_wallet_private_key>, and <your_etherscan_api_key> with your actual values.