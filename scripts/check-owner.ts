import { network } from "hardhat";

const CONTRACT_ADDRESS =
  "0x223b7f4323846e0b842cab1a9d94e8a88aa9ab16";

async function main() {
  const { viem } = await network.connect();

  const publicClient = await viem.getPublicClient();
  const walletClient = await viem.getWalletClient();

  const [deployer] = await walletClient.getAddresses();

  const owner = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: [
      {
        type: "function",
        name: "owner",
        stateMutability: "view",
        inputs: [],
        outputs: [
          {
            type: "address",
          },
        ],
      },
    ],
    functionName: "owner",
  });

  console.log("Contract:", CONTRACT_ADDRESS);
  console.log("Deployer:", deployer);
  console.log("Owner:", owner);

  if (deployer.toLowerCase() === owner.toLowerCase()) {
    console.log("SUCCESS: Deployer is the contract owner.");
  } else {
    console.log("ERROR: Deployer is NOT the contract owner.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});