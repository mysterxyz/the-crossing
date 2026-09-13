export const CORRECT_TO_FINISH = 8

export const questions = [
  {
    question: "What is Standard Reserve?",
    answers: [
      "A gaming platform",
      "A sovereign onchain central bank",
      "A centralized exchange",
      "A lending protocol",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is the currency of the Reserve?",
    answers: ["ETH", "USDC", "$STANDARD", "$RESERVE"],
    correctAnswer: 2,
  },
  {
    question: "What is a Charter?",
    answers: [
      "A governance proposal",
      "An NFT that gives the holder a license to operate a bank",
      "A liquidity pool",
      "An NFT marketplace",
    ],
    correctAnswer: 1,
  },
  {
    question: "What does a Charter contain?",
    answers: ["Branches", "NFTs", "Validators", "Liquidity pools"],
    correctAnswer: 0,
  },
  {
    question: "What does holding a Charter make you?",
    answers: ["A Miner", "A Banker", "A Validator", "A Governor"],
    correctAnswer: 1,
  },
  {
    question: "What does a Branch represent in the Reserve?",
    answers: [
      "A unit that earns a share of new STANDARD issuance",
      "A governance vote",
      "An NFT marketplace",
      "An ETH vault",
    ],
    correctAnswer: 0,
  },
  {
    question: "What can Bankers do with their Charter?",
    answers: [
      "Expand it with additional Branches",
      "Turn it into ETH",
      "Delete the Reserve",
      "Create unlimited STANDARD",
    ],
    correctAnswer: 0,
  },
  {
    question: "How many Branches does every Charter start with?",
    answers: ["1", "2", "5", "10"],
    correctAnswer: 0,
  },
  {
    question: "What happens when the Reserve is expanding?",
    answers: [
      "New STANDARD can be issued",
      "All STANDARD is burned",
      "All Charters disappear",
      "ETH is frozen",
    ],
    correctAnswer: 0,
  },
  {
    question: "What happens during contraction?",
    answers: [
      "The Reserve increases issuance",
      "The Reserve reduces issuance and can buy back STANDARD",
      "New Charters become free",
      "Branches multiply automatically",
    ],
    correctAnswer: 1,
  },
  {
    question: "What happens to STANDARD bought back by the Reserve?",
    answers: [
      "It is redistributed",
      "It is burned",
      "It is locked for 24 hours",
      "It is converted into NFTs",
    ],
    correctAnswer: 1,
  },
  {
    question: "How many Genesis Founding Charters are there?",
    answers: ["100", "500", "1,000", "10,000"],
    correctAnswer: 2,
  },
  {
    question: "What happens to the ETH from Genesis Charter mint proceeds?",
    answers: [
      "It is distributed to Bankers",
      "It funds initial liquidity and the protocol vaults",
      "It is burned",
      "It is sent entirely to the team",
    ],
    correctAnswer: 1,
  },
  {
    question: "What determines the direction of monetary policy?",
    answers: [
      "The price of ETH",
      "The number of Bankers",
      "Net ETH flow in the ETH/$STANDARD pool",
      "The number of NFTs minted",
    ],
    correctAnswer: 2,
  },
  {
    question: "What happens when net ETH flow is positive?",
    answers: [
      "The Reserve enters expansion",
      "The Reserve enters contraction",
      "All Branches close",
      "STANDARD is completely burned",
    ],
    correctAnswer: 0,
  },
  {
    question: "When does a Banker withdraw their accumulated STANDARD?",
    answers: [
      "Every day automatically",
      "When they retire a Branch",
      "When ETH enters the pool",
      "When they buy an Expansion License",
    ],
    correctAnswer: 1,
  },
  {
    question: "What happens to STANDARD spent on an Expansion License?",
    answers: [
      "It is returned to the Banker",
      "It enters liquidity",
      "It is fully burned",
      "It is distributed to other Bankers",
    ],
    correctAnswer: 2,
  },
  {
    question: "What happens when a Banker retires a Branch?",
    answers: [
      "The Branch remains active",
      "Its accrued balance is withdrawn and the Branch is permanently retired",
      "The Branch transfers to another Banker",
      "The Banker receives a new Branch",
    ],
    correctAnswer: 1,
  },
  {
    question: "What happens to the resolution fee when system-wide exit pressure increases?",
    answers: [
      "It decreases",
      "It stays fixed",
      "It increases",
      "It disappears",
    ],
    correctAnswer: 2,
  },
  {
    question: "What happens after a Charter's final Branch is retired?",
    answers: [
      "The Charter remains active forever",
      "The Charter is burned",
      "The Charter becomes a DAO",
      "The Charter becomes an NFT",
    ],
    correctAnswer: 1,
  },
]
