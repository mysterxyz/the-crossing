import { network } from "hardhat";

const CONTRACT_ADDRESS = "0x223b7f4323846e0b842cab1a9d94e8a88aa9ab16";

const MASTER_URI =
  "ipfs://bafkreicbcicpmeagueduqgm4onnemcsuvhsn5ks2a6l62ymercbyl77rla";

const WAYFINDER_URI =
  "ipfs://bafkreid7m664lbovausz7tuqmo32xutsalzpxud565nmqei4y2ayvzgu24";

const PATHFINDER_URI =
  "ipfs://bafkreiaf3zcr5azxehp3jhljzpiwsgothqqq44yxt3ykabeibsxurh3eiu";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();
const walletClient = await viem.getWalletClient();

const [owner] = await walletClient.getAddresses();

console.log("Contract:", CONTRACT_ADDRESS);
console.log("Owner:", owner);

const contract = await viem.getContractAt(
  "TheCrossing",
  CONTRACT_ADDRESS
);

console.log("Setting Tier 1 — MASTER...");
await contract.write.setTierURI([1, MASTER_URI]);

console.log("Setting Tier 2 — WAYFINDER...");
await contract.write.setTierURI([2, WAYFINDER_URI]);

console.log("Setting Tier 3 — PATHFINDER...");
await contract.write.setTierURI([3, PATHFINDER_URI]);

console.log("SUCCESS: All tier URIs have been set!");