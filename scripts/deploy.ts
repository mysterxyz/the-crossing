import { network } from "hardhat";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const walletClient = await viem.getWalletClient();

const [deployer] = await walletClient.getAddresses();

console.log("Deployer:", deployer);
console.log("Chain ID:", await publicClient.getChainId());

const balance = await publicClient.getBalance({
  address: deployer,
});

console.log("Balance:", balance.toString(), "wei");

console.log("Sending deployment transaction...");

const { deploymentTransaction } =
  await viem.sendDeploymentTransaction(
    "TheCrossing",
    [deployer],
    {
      gas: 10_000_000n,
    }
  );

console.log("Transaction hash:", deploymentTransaction.hash);
console.log("Transaction nonce:", deploymentTransaction.nonce);
console.log("Transaction block:", deploymentTransaction.blockNumber);

const receipt = await publicClient.waitForTransactionReceipt({
  hash: deploymentTransaction.hash,
});

console.log("Receipt status:", receipt.status);
console.log("Contract address:", receipt.contractAddress);
console.log("Gas used:", receipt.gasUsed.toString());

if (!receipt.contractAddress) {
  throw new Error("Deployment failed: no contract address in receipt");
}

const code = await publicClient.getCode({
  address: receipt.contractAddress,
});

console.log("Contract code length:", code?.length ?? 0);

if (!code || code === "0x") {
  throw new Error("Deployment failed: contract code is empty");
}

console.log("SUCCESS: TheCrossing is deployed!");