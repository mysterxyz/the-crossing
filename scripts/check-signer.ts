import { network } from "hardhat";

const CONTRACT_ADDRESS =
  "0x223b7f4323846e0b842cab1a9d94e8a88aa9ab16";

const { viem } = await network.connect();

const contract = await viem.getContractAt(
  "TheCrossing",
  CONTRACT_ADDRESS
);

const signer = await contract.read.authorizedSigner();

console.log("Contract:", CONTRACT_ADDRESS);
console.log("Authorized signer:", signer);