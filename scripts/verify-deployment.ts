import { network } from "hardhat";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();

const DEPLOYER =
  "0x09DCb22D20f9e8Ab19aD4b980c665508F10760A7" as `0x${string}`;

const BLOCK_NUMBER = 62013857n;

console.log("Network Chain ID:", await publicClient.getChainId());
console.log("Checking block:", BLOCK_NUMBER.toString());
console.log("Deployer:", DEPLOYER);

const block = await publicClient.getBlock({
  blockNumber: BLOCK_NUMBER,
  includeTransactions: true,
});

console.log("Transactions in block:", block.transactions.length);

for (const tx of block.transactions) {
  if (typeof tx === "string") {
    continue;
  }

  console.log("---");
  console.log("TX hash:", tx.hash);
  console.log("From:", tx.from);
  console.log("To:", tx.to);
  console.log("Nonce:", tx.nonce);

  if (
    tx.from.toLowerCase() === DEPLOYER.toLowerCase() &&
    tx.to === null
  ) {
    console.log("");
    console.log("DEPLOYMENT TRANSACTION FOUND!");
    console.log("Hash:", tx.hash);
    console.log("Nonce:", tx.nonce);

    const receipt = await publicClient.getTransactionReceipt({
      hash: tx.hash,
    });

    console.log("Status:", receipt.status);
    console.log("Contract address:", receipt.contractAddress);
    console.log("Gas used:", receipt.gasUsed.toString());

    if (receipt.contractAddress) {
      const code = await publicClient.getCode({
        address: receipt.contractAddress,
      });

      console.log("Contract code length:", code?.length ?? 0);

      if (code && code !== "0x") {
        console.log("");
        console.log("SUCCESS: TheCrossing exists on Robinhood Chain.");
      }
    }
  }
}