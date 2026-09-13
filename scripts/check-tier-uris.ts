import { network } from "hardhat";

const CONTRACT_ADDRESS = "0x223b7f4323846e0b842cab1a9d94e8a88aa9ab16";

const { viem } = await network.connect();

const contract = await viem.getContractAt(
  "TheCrossing",
  CONTRACT_ADDRESS
);

console.log("Contract:", CONTRACT_ADDRESS);
console.log("Checking tier metadata...\n");

for (const tier of [1, 2, 3]) {
  const uri = await contract.read.tierURI([tier]);

  console.log(`Tier ${tier}:`);
  console.log(`URI: ${uri}`);
  console.log("");
}