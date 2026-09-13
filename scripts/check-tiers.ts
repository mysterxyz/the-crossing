import { network } from "hardhat";

const CONTRACT_ADDRESS =
  "0x223b7f4323846e0b842cab1a9d94e8a88aa9ab16";

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();

console.log("Chain ID:", await publicClient.getChainId());
console.log("Contract:", CONTRACT_ADDRESS);

const contract = await viem.getContractAt(
  "TheCrossing",
  CONTRACT_ADDRESS
);

console.log("Checking tier system...");

for (const tier of [1, 2, 3]) {
  try {
    const uri = await contract.read.tierURI([tier]);

    console.log(`Tier ${tier}: OK`);
    console.log(`URI: ${uri}`);
  } catch (error) {
    console.log(`Tier ${tier}: ERROR`);
    console.log(error);
  }
}

console.log("Checking invalid tier...");

try {
  await contract.read.tierURI([4]);
  console.log("ERROR: Tier 4 was accepted!");
} catch {
  console.log("Tier 4: correctly rejected");
}