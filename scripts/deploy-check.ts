import { network } from "hardhat";

const { viem } = await network.connect();

const publicClient = await viem.getPublicClient();

console.log("Chain ID:", await publicClient.getChainId());

const block = await publicClient.getBlock();

console.log("Latest block:", block.number);
console.log("Block hash:", block.hash);