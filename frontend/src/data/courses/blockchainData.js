// Blockchain & Web3 Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "bc-phase-1",
    title: "Phase 1: Cryptography, Networks & Consensus (Weeks 1–2)",
    description: "Master the foundations of distributed systems, cryptographic hashing, public/private addresses, PoW/PoS consensus, and EVM executions.",
    modules: [
      {
        id: "bc-m-1",
        title: "Module 1: Cryptographic Foundations of Blockchain",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Understand peer-to-peer distributed ledger networks",
          "Explain sha-256 and cryptographic hashing pointer security",
          "Derive public and private wallets addresses using ECDSA principles",
          "Map block header components and Merkle Tree validation trees"
        ],
        lessons: [
          {
            id: "bc-l-1-1",
            title: "What is a Blockchain?",
            time: "45 min",
            summary: "Decentralized networks, peer-to-peer architecture, and distributed ledger technology.",
            content: `
### What is a Blockchain?

A blockchain is a decentralized, peer-to-peer (P2P) distributed database that maintains a continuously growing list of records, called blocks, secured using cryptography. Unlike a traditional centralized SQL database managed by a single administrator (e.g., a bank or cloud provider), a blockchain is copied and shared across a network of independent computers (nodes).

#### Core Characteristics:
1. **Decentralization:** No single entity controls the network. Changes must be approved through consensus.
2. **Immutability:** Once data is written to a block, it is practically impossible to change without altering all subsequent blocks and gaining network consensus.
3. **Transparency:** All transaction records are publicly verifiable, creating trust without middlemen.
4. **Peer-to-Peer Transactions:** Participants transact directly with each other, eliminating brokers.

#### Real-World Example:
Traditional banking acts as a centralized ledger: when Alice sends $10 to Bob, the bank verifies Alice's balance, deducts it, and credits Bob. On a blockchain, Alice broadcasts this transaction directly to the network. Network nodes validate the transaction, package it into a block, and write it permanently to their local ledger copies.

#### Quiz Questions:
1. **What is a major advantage of a distributed ledger over a centralized database?**
   *   a) Lower storage requirements
   *   b) Elimination of single points of failure and middleman costs (Correct)
   *   c) Faster database read speeds
2. **What does immutability mean in blockchain?**
   *   a) Anyone can change the data
   *   b) The data can be deleted easily
   *   c) Once recorded, the data cannot be modified without altering subsequent blocks (Correct)

#### Interview Questions:
* **How does a peer-to-peer network ensure data synchronization without a master node?**
  *   *Answer:* It relies on a consensus protocol (like Proof of Work or Proof of Stake). Each node runs validator software that listens for new transactions, validates them based on network rules, and uses peer gossip protocols to broadcast updates so that all nodes keep identical copies of the database.
* **Why would an enterprise select a distributed ledger over a traditional SQL database?**
  *   *Answer:* Distributed ledgers are chosen when multiple untrusted parties need to share a single source of truth without relying on a central authority. It provides built-in audit trails, cryptographically verified integrity, and guarantees high availability due to multi-node replication.

#### Summary:
Blockchain is a peer-to-peer distributed ledger system that records transactions securely and immutably using cryptography. It eliminates the need for central authorities, distributing the responsibility of record-keeping across independent nodes.
            `,
            exercise: "Write a short paragraph analyzing the security differences between storing financial transactions on a centralized database versus a distributed blockchain network."
          },
          {
            id: "bc-l-1-2",
            title: "Cryptographic Hash Functions",
            time: "50 min",
            summary: "One-way hashes, SHA-256 mechanics, collision resistance, and data integrity verification.",
            content: `
### Cryptographic Hash Functions

Cryptographic hashing is the process of taking input data of any size and converting it into a fixed-size string of characters, typically a hexadecimal number. Blockchains use hashes to secure block headers, link blocks together, and verify data integrity.

#### Properties of Cryptographic Hash Functions:
*   **Deterministic:** The same input will always produce the exact same output.
*   **Quick Computation:** The algorithm can compute the hash of any given data quickly.
*   **Pre-Image Resistance (One-Way):** Given a hash, it is computationally infeasible to reverse-engineer the input.
*   **Small Changes Big Effects (Avalanche Effect):** Changing a single bit in the input entirely alters the output hash.
*   **Collision Resistance:** It is mathematically highly improbable to find two different inputs that produce the same output hash.

#### SHA-256 Code Example (Node.js):
\`\`\`javascript
const crypto = require('crypto');

function getSHA256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

console.log("Hash 1:", getSHA256("Blockchain Basics"));
// Output: Hash 1: a206b0a1d4ec48ab...
console.log("Hash 2:", getSHA256("blockchain basics"));
// Output: Hash 2: f9012a6730cd... (Entirely different due to one character change)
\`\`\`

#### Real-World Example:
Hash pointers are used to link blocks. Block 2 contains the transaction list and the cryptographic hash of Block 1's header. If an attacker tries to modify a transaction in Block 1, Block 1's hash changes. Consequently, Block 2's header (which references Block 1's hash) becomes invalid, breaking the chain.

#### Quiz Questions:
1. **Which property ensures that a hash function cannot be run in reverse to find the input?**
   *   a) Collision resistance
   *   b) Pre-image resistance (Correct)
   *   c) Determinism
2. **If you change a single character in a 10,000-word file, what happens to its SHA-256 hash?**
   *   a) It remains the same
   *   b) Only the last character of the hash changes
   *   c) The output hash changes completely (Correct)

#### Interview Questions:
* **What is the avalanche effect in hashing?**
  *   *Answer:* The avalanche effect is a property where a tiny, single-bit modification in the input data leads to a massive, unrecognizable shift in the resulting cryptographic hash, preventing hackers from predicting changes.
* **Why is SHA-256 secure against brute-force attacks?**
  *   *Answer:* Because SHA-256 generates a 256-bit output. The size of the search space is 2^256, which is larger than the number of atoms in the observable universe, making finding a duplicate hash via random guessing computationally impossible.

#### Summary:
Cryptographic hash functions are one-way algorithms that transform data into unique, fixed-size hashes. They form the backbone of blockchain security, linking blocks via hash pointers to enforce immutability.
            `,
            exercise: "Write a small Node.js script using the crypto library to generate the SHA-256 hash of your full name and print it in hexadecimal format."
          },
          {
            id: "bc-l-1-3",
            title: "Public Key Cryptography & Wallets",
            time: "55 min",
            summary: "Asymmetric cryptography, public/private keys, ECDSA algorithms, and wallet address derivation.",
            content: `
### Public Key Cryptography & Wallets

Blockchains use **Asymmetric Cryptography** (Public Key Cryptography) to handle ownership and authorize transactions. Instead of a single username and password, blockchain users have a mathematically linked pair of cryptographic keys: a **Private Key** and a **Public Key**.

#### Key Pairs:
1. **Private Key:** A randomly generated, 256-bit secret number. Whoever possesses this key owns the funds associated with it. It is used to generate **Digital Signatures** that authorize transactions.
2. **Public Key:** Mathematically derived from the private key using an algorithm (typically ECDSA - Elliptic Curve Digital Signature Algorithm). It can be shared publicly.
3. **Wallet Address:** A shorter, formatted version of the public key (often hashed, e.g., using Keccak-256 in Ethereum) representing the destination address for receiving funds.

#### Address Derivation Workflow:
\`\`\`
[Private Key (Secret)] 
       |
       v (Elliptic Curve Multiplication - ECDSA)
[Public Key (Shareable)]
       |
       v (Keccak-256 / SHA-256 Hashing + Formatting)
[Public Address (e.g. 0x71C...)]
\`\`\`

#### Real-World Example:
Think of a public address like your mailbox address: anyone can look it up and drop envelopes (tokens) in it. Think of the private key like your physical mailbox key: only you hold it, and you need it to open the box and retrieve or send mail.

#### Quiz Questions:
1. **Which key is used to sign transactions to authorize transfer of ownership?**
   *   a) Public Key
   *   b) Private Key (Correct)
   *   c) Wallet Address
2. **Can you derive a private key if you know the public address?**
   *   a) Yes, using inverse division
   *   b) No, the elliptic curve generation is a one-way mathematical trapdoor (Correct)

#### Interview Questions:
* **How does the ECDSA trapdoor function protect private keys?**
  *   *Answer:* ECDSA relies on the difficulty of the Elliptic Curve Discrete Logarithm Problem. While multiplying a curve point by a private key scalar is computationally instant, reversing the process to find the private key scalar from the public curve point is mathematically intractable for classical computers.
* **What is the difference between a custodial wallet and a non-custodial wallet?**
  *   *Answer:* In a non-custodial wallet, the user has exclusive control over the private keys. In a custodial wallet (like on exchanges), a third party manages the private keys on the user's behalf.

#### Summary:
Asymmetric cryptography secures wallets using private keys to sign transactions and public keys (hashed into addresses) to receive tokens. Private keys must remain secret to protect wallet ownership.
            `,
            exercise: "Draw a flowchart displaying the path from a randomly generated seed phrase down to a public Ethereum address."
          },
          {
            id: "bc-l-1-4",
            title: "The Block Header & Merkle Trees",
            time: "50 min",
            summary: "Block structures, index parameters, difficulty targets, and Merkle tree transaction audits.",
            content: `
### Block Header & Merkle Trees

A blockchain block contains two main components: the **Block Header** (metadata describing the block) and the **Transaction Ledger** (the list of actual transactions).

#### Block Header Structure:
*   **Previous Block Hash:** Links this block to the previous block in the chain.
*   **Timestamp:** The time the block was mined.
*   **Difficulty Target & Nonce:** Parameters used in mining consensus.
*   **Merkle Root:** A single hash that summarizes all transactions in the block.

#### Merkle Trees:
A Merkle Tree is a binary tree of hashes. Transactions are hashed individually, paired, and hashed again recursively until only one hash remains: the **Merkle Root**.
\`\`\`
          [Merkle Root (Hash ABCD)]
                /            \\
        [Hash AB]            [Hash CD]
        /       \\            /       \\
    [Hash A]   [Hash B]  [Hash C]   [Hash D]
       |          |         |          |
     [Tx A]     [Tx B]    [Tx C]     [Tx D]
\`\`\`
This structure allows **Simplified Payment Verification (SPV)**. A node can verify that transaction 'C' is in the block without downloading all transactions by using a **Merkle Proof** (which only requires Hash D and Hash AB).

#### Quiz Questions:
1. **What is the purpose of a Merkle Root in a block header?**
   *   a) To record mining difficulty
   *   b) To cryptographically summarize all transactions in the block for instant validation (Correct)
   *   c) To store wallet private keys
2. **How many hashes do you need to calculate to prove a transaction's inclusion if a block has 8 transactions using a Merkle proof?**
   *   a) 8 hashes
   *   b) 3 hashes (Log2 of 8) (Correct)
   *   c) 64 hashes

#### Interview Questions:
* **What is a Merkle Proof and how does it optimize light client operations?**
  *   *Answer:* A Merkle Proof consists of the target transaction's hash and the sibling hashes up the path to the Merkle Root. It allows light client nodes (like mobile wallets) to verify transaction integrity by hashing only logarithmic sets of data, without storing the complete transaction history.
* **What happens to the block header if an attacker alters one transaction at the bottom of the Merkle Tree?**
  *   *Answer:* Changing a transaction changes its leaf hash. This causes a cascade of hash changes up the tree, changing the Merkle Root. Since the Merkle Root is stored in the header, the entire block header's hash changes, invalidating the block.

#### Summary:
Block headers store metadata linking the chain, including the Merkle Root. Merkle Trees recursively hash transaction lists, enabling nodes to verify transaction integrity using minimal data.
            `,
            exercise: "Given four transactions with hashes H_A, H_B, H_C, and H_D, calculate how the Merkle root is derived step-by-step using hashing functions."
          },
          {
            id: "bc-l-1-5",
            title: "Double Spending & Byzantine Generals Problem",
            time: "55 min",
            summary: "Double-spending attacks, distributed failures, and Byzantine Fault Tolerance in trustless systems.",
            content: `
### Double Spending & Byzantine Generals Problem

In digital cash systems, double spending occurs when a user tries to spend the same digital token twice. Physical cash prevents this naturally (once you hand over a bill, you no longer have it), but digital files can be copied.

#### The Byzantine Generals Problem:
How can distributed nodes in a network reach consensus on a state update (like a ledger transaction) when some nodes are malicious, unreliable, or slow?
*   **Generals = Nodes:** Must agree to coordinate an action (attack or retreat).
*   **Traitors = Bad Nodes:** Try to send conflicting messages to different nodes to prevent consensus.

#### Solutions in Blockchain:
Satoshi Nakamoto solved this by combining cryptographic proof of work with peer-to-peer timestamping. Nodes invest computational power (Proof of Work) to propose blocks. The "longest chain rule" establishes that the chain with the most cumulative Proof of Work is accepted as the official history.

#### Real-World Example:
Imagine 5 generals planning to attack a fortress. They need a majority vote to succeed. If one general is a traitor and sends 'Attack' to two generals and 'Retreat' to the other two, they will fail. Blockchains resolve this by forcing the proposal node to solve a complex puzzle, ensuring only one valid block is proposed per interval.

#### Quiz Questions:
1. **What is double-spending?**
   *   a) Earning double interest on staking
   *   b) Firing two transactions at the same time to spend the same balance twice (Correct)
   *   c) Paying double gas fees
2. **What rule do blockchain networks use to resolve conflicting ledger branches?**
   *   a) First-in first-out rule
   *   b) The longest chain rule (greatest cumulative proof of work) (Correct)
   *   c) Manual voting by validators

#### Interview Questions:
* **What is Byzantine Fault Tolerance (BFT)?**
  *   *Answer:* BFT is the ability of a distributed computer network to function correctly and reach consensus despite some nodes failing or transmitting fraudulent transaction data, as long as malicious nodes do not exceed a critical threshold (typically 1/3 in classic BFT, or 51% in Proof of Work).
* **How does the longest chain rule resolve network forks?**
  *   *Answer:* When two miners find blocks simultaneously, the network forks. Nodes save both branches. Once a miner finds a subsequent block on one of the branches, that branch becomes longer. Nodes automatically switch to the longer chain as it represents the branch with the most computational proof of work.

#### Summary:
The Byzantine Generals Problem defines the challenge of reaching consensus in distributed, untrusted systems. Blockchains use consensus mechanisms and the longest chain rule to prevent double spending.
            `,
            exercise: "Draft an essay detailing how Bitcoin's Proof of Work solved the Byzantine Generals problem where previous electronic cash projects (like eCash or DigiCash) failed."
          }
        ]
      },
      {
        id: "bc-m-2",
        title: "Module 2: Consensus Protocols & Architectures",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Differentiate mining mechanics in Proof of Work (PoW)",
          "Analyze validator stakes, slashing, and Proof of Stake (PoS)",
          "Evaluate alternative consensus systems like Delegated PoS (DPoS) and Proof of Authority (PoA)",
          "Compare public, private, and consortium ledger architectures"
        ],
        lessons: [
          {
            id: "bc-l-2-1",
            title: "Proof of Work (PoW) Consensus",
            time: "50 min",
            summary: "Mining mechanics, target difficulty adjustment, hash rate, and energy profiles.",
            content: `
### Proof of Work (PoW) Consensus

Proof of Work is the consensus mechanism popularized by Bitcoin. Nodes (called **Miners**) compete to solve a complex mathematical puzzle. The first miner to find the solution gets the right to append a new block of transactions to the blockchain and receive block rewards.

#### The Mining Process:
1.  **Hashing Header:** Miners gather pending transactions and hash them into a Merkle root.
2.  **Changing Nonce:** Miners calculate the hash of the block header:
    \`Hash = SHA256(SHA256(Block Header Content + Nonce))\`
3.  **Target Match:** The target requires the hash value to be below a specific target difficulty (meaning it must start with a certain number of leading zeroes).
4.  **Looping:** Since the hash is unpredictable, miners change the **Nonce** (a number used once) and recalculate until a valid hash is found.

#### Python Mining Simulator:
\`\`\`python
import hashlib

def mine_block(block_number, transactions, previous_hash, difficulty):
    prefix_zeros = '0' * difficulty
    nonce = 0
    while True:
        text = str(block_number) + transactions + previous_hash + str(nonce)
        hash_result = hashlib.sha256(text.encode()).hexdigest()
        if hash_result.startswith(prefix_zeros):
            print(f"Mined successfully with nonce: {nonce}")
            print(f"Hash: {hash_result}")
            return hash_result
        nonce += 1

# Mine with difficulty 4 (starts with '0000')
mine_block(1, "Alice->Bob:5", "0000a1b2c3d4", 4)
\`\`\`

#### Quiz Questions:
1. **What is a nonce in blockchain mining?**
   *   a) A private key parameter
   *   b) A random integer incremented to change the block header's hash output (Correct)
   *   c) The total volume of transactions in a block
2. **What happens to block generation times if more miners join the PoW network?**
   *   a) Blocks are found faster permanently
   *   b) The network adjusts the difficulty target to keep mining times stable (Correct)
   *   c) The block size is halved

#### Interview Questions:
* **How does difficulty adjustment work in Proof of Work?**
  *   *Answer:* To maintain consistent block generation times (e.g., 10 minutes in Bitcoin), the protocol adjusts the target difficulty periodically (every 2016 blocks in Bitcoin). If blocks are found faster than the target, the puzzle difficulty increases (the target threshold decreases).
* **What is a 51% attack on a Proof of Work network?**
  *   *Answer:* It occurs when a single entity controls more than 50% of the network's hashing power. This allows the attacker to double-spend coins by creating a private chain branch faster than the rest of the network and broadcasting it to override the public chain.

#### Summary:
Proof of Work requires miners to spend electricity finding a nonce that generates a block hash with required leading zeros. Difficulty adjustments keep block times consistent.
            `,
            exercise: "Run the Python mining script locally (or trace it manually) with difficulty set to 2, 3, and 4. Document how the number of iterations grows exponentially."
          },
          {
            id: "bc-l-2-2",
            title: "Proof of Stake (PoS) Consensus",
            time: "55 min",
            summary: "Staking pools, validator selection, slashing risks, and the Ethereum Merge.",
            content: `
### Proof of Stake (PoS) Consensus

Proof of Stake replaces resource-intensive computer mining with a system where validators lock up native coins (staking) as collateral. Validators are chosen to propose new blocks based on their stake size and other metrics.

#### Key Concepts of PoS:
*   **Validators:** Replaces miners. They run validator nodes and stake collateral (e.g., 32 ETH on Ethereum).
*   **Attestation:** Validators vote to approve proposed blocks.
*   **Block Rewards:** Validators earn fees and newly minted tokens for validating.
*   **Slashing:** Malicious actions (such as validating competing blocks or proposing invalid transactions) result in the validator losing a portion of their staked coins.

#### PoW vs. PoS Comparison:
| Metric | Proof of Work (PoW) | Proof of Stake (PoS) |
| :--- | :--- | :--- |
| **Resource** | Computational Hardware & Power | Staked Crypto Tokens |
| **Security** | Hardware cost barrier | Collateral destruction (Slashing) |
| **Efficiency**| Energy intensive | Eco-friendly (99.9% less energy) |

#### Quiz Questions:
1. **How is double validation prevented in Proof of Stake?**
   *   a) By purchasing more mining chips
   *   b) By slashing (destroying) the validator's staked collateral (Correct)
   *   c) By shutting down the validator node
2. **Which consensus mechanism is used by Ethereum post-Merge?**
   *   a) Proof of Work
   *   b) Proof of Stake (Correct)
   *   c) Proof of Authority

#### Interview Questions:
* **What is the Nothing-at-Stake problem in PoS networks?**
  *   *Answer:* In the event of a chain fork, validators have nothing to lose by validating blocks on both branches, since it doesn't cost compute resources. This is prevented in modern PoS networks by slashing rules that penalize validating on conflicting branches.
* **Explain how Proof of Stake decreases energy usage compared to Proof of Work.**
  *   *Answer:* PoW requires millions of mining rigs running hash functions endlessly. PoS does not require computational competition; it selects validators deterministically based on stake size, requiring only normal server computers.

#### Summary:
Proof of Stake selects block validators based on their staked token collateral. It prevents fraud via slashing rules and uses significantly less energy than Proof of Work.
            `,
            exercise: "Research the Ethereum Merge of 2022 and write a brief summary of how the consensus shift affected network security and issuance rates."
          },
          {
            id: "bc-l-2-3",
            title: "Alternative Consensus Protocols",
            time: "50 min",
            summary: "Delegated Proof of Stake (DPoS), Proof of Authority (PoA), and federated consensus models.",
            content: `
### Alternative Consensus Protocols

While PoW and PoS are the most common consensus mechanisms, other protocols exist to optimize transaction speed, throughput, and governance for different blockchain use cases.

#### 1. Delegated Proof of Stake (DPoS):
Token holders vote to elect a small group of delegates (usually 21 to 101 nodes, called delegates or witnesses) to validate blocks. This concentration allows for faster transaction speeds.
*   **Pros:** High throughput, low latency.
*   **Cons:** More centralized, potential for voter apathy.

#### 2. Proof of Authority (PoA):
Used in private or consortium blockchains. Validation rights are granted to pre-approved, trusted entities whose real identities are verified.
*   **Pros:** High performance, no computational overhead.
*   **Cons:** Highly centralized; relies entirely on trust in validator identities.

#### Real-World Example:
EOS uses DPoS to achieve sub-second block times. Hyperledger Besu networks often use PoA for enterprise supply chains, where validators are known, trusted corporate entities.

#### Quiz Questions:
1. **In Delegated Proof of Stake (DPoS), who proposes and validates blocks?**
   *   a) All nodes dynamically
   *   b) Elected delegates voted in by token holders (Correct)
   *   c) Miners solving math puzzles
2. **Which consensus mechanism is ideal for a private enterprise blockchain where all participants are known?**
   *   a) Proof of Work
   *   b) Proof of Authority (Correct)
   *   c) Proof of Burn

#### Interview Questions:
* **Why does DPoS achieve higher transactions-per-second (TPS) compared to traditional PoS?**
  *   *Answer:* Traditional PoS requires consensus across thousands of validator nodes. DPoS limits validation to a small number of elected delegates, reducing the communication overhead required to reach consensus.
* **What is a major vulnerability of Proof of Authority (PoA)?**
  *   *Answer:* Since validator identities are public, they are vulnerable to targeted denial-of-service (DoS) attacks or real-world coercion. If validators collude, they have total control over block production.

#### Summary:
DPoS increases throughput by electing a small pool of block producers, while PoA secures networks by linking validation permissions to verified real-world identities.
            `,
            exercise: "Create a comparison matrix listing PoW, PoS, DPoS, and PoA against three criteria: Decentralization, Transaction Throughput (TPS), and Energy Consumption."
          },
          {
            id: "bc-l-2-4",
            title: "Public, Private & Consortium Networks",
            time: "45 min",
            summary: "Permissioned vs permissionless architectures, access control layers, and business models.",
            content: `
### Public, Private & Consortium Networks

Blockchains are categorized based on who is allowed to read, write, and validate transactions on the ledger.

#### Types of Blockchains:
1.  **Public (Permissionless):** Anyone can read, write transactions, and participate in consensus (e.g., Bitcoin, Ethereum).
    *   *Trust Model:* Zero trust required; secured by cryptography and consensus.
2.  **Private (Permissioned):** Controlled by a single organization. Access to read and write is restricted to invited nodes (e.g., Hyperledger Fabric).
    *   *Trust Model:* Centralized trust in the managing organization.
3.  **Consortium (Federated):** Managed by a group of organizations (e.g., a group of 10 banks). Consensus is run by pre-selected nodes.
    *   *Trust Model:* Distributed trust among member organizations.

#### Network Architecture Matrix:
| Feature | Public | Private | Consortium |
| :--- | :--- | :--- | :--- |
| **Access** | Anyone | Invite-only | Group member-only |
| **Speed** | Slow to Moderate | Extremely Fast | Fast |
| **Decentralization** | High | Low (None) | Medium |

#### Real-World Example:
A public network like Ethereum is used for open DeFi applications. A private network is used by a single company for internal data audits. A consortium network is used by global shipping companies to track containers across oceans.

#### Quiz Questions:
1. **Which type of blockchain allows anyone to download code and participate in mining/validation?**
   *   a) Private
   *   b) Consortium
   *   c) Public (Permissionless) (Correct)
2. **What is a consortium blockchain?**
   *   a) A network run by a single person
   *   b) A semi-decentralized network managed by a group of pre-approved organizations (Correct)
   *   c) A network with no security controls

#### Interview Questions:
* **What is the trade-off between permissionless and permissioned blockchains regarding scalability?**
  *   *Answer:* Permissionless chains prioritize decentralization and censorship resistance, which requires gossip protocols and complex consensus, limiting throughput. Permissioned chains have trusted, high-performance validator nodes, enabling higher throughput and near-instant finality.
* **Why would a logistics consortium use Hyperledger instead of Ethereum?**
  *   *Answer:* Hyperledger provides fine-grained access control, private transactions, and does not require a native token to pay gas fees, which is ideal for businesses that want to keep proprietary data private.

#### Summary:
Public blockchains are permissionless and open. Private blockchains are permissioned and centralized within one company. Consortium blockchains distribute ledger management among a group of organizations.
            `,
            exercise: "Analyze a real-world scenario (e.g., tracking retail pharmacy logistics) and argue whether a public, private, or consortium blockchain is best suited for it."
          },
          {
            id: "bc-l-2-5",
            title: "Ethereum & Ethereum Virtual Machine (EVM)",
            time: "55 min",
            summary: "EVM Turing completeness, account storage states, gas mechanics, and block execution.",
            content: `
### Ethereum & Ethereum Virtual Machine (EVM)

Ethereum expanded blockchain capabilities beyond simple asset transfers by introducing smart contracts. The core engine executing this smart contract logic is the **Ethereum Virtual Machine (EVM)**.

#### Key Concepts:
*   **Turing Completeness:** The EVM can execute any computational logic (loops, conditionals), unlike Bitcoin's limited scripting language.
*   **EVM Bytecode:** High-level code (e.g., Solidity) is compiled into EVM bytecode (low-level assembly instructions, like \`PUSH1\`, \`SSTORE\`, \`MSTORE\`).
*   **Accounts Model:** Ethereum uses accounts rather than UTXOs (Unspent Transaction Outputs):
    1.  **Externally Owned Accounts (EOA):** Controlled by private keys (user wallets).
    2.  **Contract Accounts:** Controlled by smart contract code. They have an address, a balance, and storage.

#### Gas Mechanics:
Every EVM opcode costs a specific amount of **Gas** (e.g., \`ADD\` costs 3 gas, \`SSTORE\` costs up to 20,000 gas to write to storage). Users specify a **Gas Price** they are willing to pay per unit of gas. This prevents infinite loops (like an infinite \`while\` loop), as the transaction will run out of gas and revert.

#### Quiz Questions:
1. **What compiles Solidity code into EVM bytecode?**
   *   a) Web browser
   *   b) Solidity Compiler (solc) (Correct)
   *   c) MetaMask wallet
2. **Why does the EVM charge Gas for transactions?**
   *   a) To pay transaction validators and prevent infinite loops (Correct)
   *   b) To buy server CPU hardware
   *   c) To decrease transaction speeds

#### Interview Questions:
* **What is the difference between state storage (SSTORE) and memory (MSTORE) in the EVM?**
  *   *Answer:* Storage (\`SSTORE\`) is persistent database storage written to the blockchain, which is expensive (up to 20,000 gas). Memory (\`MSTORE\`) is temporary runtime memory that is cleared after the transaction execution completes and is significantly cheaper.
* **Explain how gas limits prevent Denial of Service (DoS) attacks on the EVM.**
  *   *Answer:* Without gas, an attacker could deploy a contract with an infinite loop, freezing all validating nodes. Because each operation costs gas, the transaction will run out of gas, halt, and revert, keeping the network safe.

#### Summary:
The EVM is a global virtual computer executing compiled smart contract bytecode. Ethereum's accounts model and gas limits prevent infinite loops and ensure validator compensation.
            `,
            exercise: "Look up an EVM opcode table and write down the gas costs for reading from storage (SLOAD) versus writing to storage (SSTORE)."
          }
        ]
      }
    ]
  },
  {
    id: "bc-phase-2",
    title: "Phase 2: Solidity Development & Smart Contracts (Weeks 3–4)",
    description: "Write Solidity smart contracts, compile bytecode in Remix, manage global variables, deploy ERC standards, audit reentrancy, and link dapps.",
    modules: [
      {
        id: "bc-m-3",
        title: "Module 3: Solidity Core Language Programming",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Write state variables and understand visibility rules",
          "Apply custom modifiers and functions logic gates",
          "Construct mappings structures and handle lists variables",
          "Trigger event logs and handle transaction exceptions using require/revert"
        ],
        lessons: [
          {
            id: "bc-l-3-1",
            title: "Solidity Syntax, State & Types",
            time: "50 min",
            summary: "Solidity contract structure, value types vs reference types, and state variable storage.",
            content: `
### Solidity Syntax, State & Types

Solidity is a statically-typed, contract-oriented language designed for writing smart contracts on the EVM.

#### Contract Structure & Basic Types:
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BasicTypes {
    // State variables (stored permanently in blockchain storage)
    uint256 public score = 100; // Unsigned integer
    int256 public balance = -50; // Signed integer
    bool public isActive = true;
    address public owner = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    string public name = "Alice";

    // Value Types vs Reference Types:
    // Value types store data directly.
    // Reference types (like strings, arrays, structs, mappings) store the reference to data location.
}
\`\`\`

#### State Visibility Rules:
*   **public:** Generates an automatic getter function. Accessible internally and externally.
*   **private:** Only accessible within the contract.
*   **internal:** Accessible within the contract and derived contracts.

#### Quiz Questions:
1. **Where are state variables stored?**
   *   a) Temporary RAM memory
   *   b) Persistent blockchain storage (Correct)
   *   c) Web browsers cache
2. **Which visibility keyword allows a variable to be accessed by a derived contract but not by external users?**
   *   a) public
   *   b) private
   *   c) internal (Correct)

#### Interview Questions:
* **What is the difference between uint8 and uint256 in Solidity, and does using uint8 always save gas?**
  *   *Answer:* \`uint8\` uses 8 bits of storage, while \`uint256\` uses 256 bits. However, the EVM processes data in 32-byte (256-bit) slots. Using \`uint8\` requires the EVM to mask the remaining bits, which can actually consume more gas than using a raw \`uint256\`, unless variables are packed together inside a struct.
* **Why does Solidity compile state variables marked as public with an automatic getter function?**
  *   *Answer:* To make reading contract state easy. The compiler generates an external view function of the same name, allowing developers and client libraries to query the variable value without sending a transaction.

#### Summary:
Solidity is a statically-typed language where state variables are saved permanently to blockchain storage slots. Visibility keywords control access limits.
            `,
            exercise: "Create a Solidity contract containing state variables of types uint, address, and bool. Deploy it in Remix and test the auto-generated getter functions."
          },
          {
            id: "bc-l-3-2",
            title: "Functions, Visibility & Access Modifiers",
            time: "55 min",
            summary: "Pure vs view functions, external calls visibility, and writing custom access modifiers.",
            content: `
### Functions, Visibility & Access Modifiers

Functions in Solidity can modify or query the state of a contract. Visibility and state mutability keywords determine who can execute functions and how much gas they consume.

#### State Mutability:
*   **view:** Reads state variables but does not modify them. (Zero gas when called externally).
*   **pure:** Does not read or modify state variables. (Zero gas when called externally).
*   **Default (Payable/Non-Payable):** Can modify state and write to storage.

#### Visibility:
*   **public:** Can be called internally and externally.
*   **external:** Can only be called externally.
*   **internal:** Can only be called from inside the contract or inherited contracts.
*   **private:** Can only be called from inside the contract itself.

#### Access Modifiers:
Access modifiers are reusable code wrappers that validate inputs before running function logic.
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControl {
    address public owner;

    constructor() {
        owner = msg.sender; // msg.sender is the address that deployed the contract
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Error: Caller is not the owner");
        _; // Underscore indicates where the rest of the function runs
    }

    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
\`\`\`

#### Quiz Questions:
1. **What does a 'pure' function do?**
   *   a) Reads blockchain data
   *   b) Neither reads nor modifies blockchain state (Correct)
   *   c) Destroys the contract
2. **What does the underscore (_ ;) represent in a custom modifier?**
   *   a) An empty variable
   *   b) The point where the guarded function's code is executed (Correct)
   *   c) A syntax comment

#### Interview Questions:
* **Why is public visibility more gas-expensive than external visibility for large array inputs?**
  *   *Answer:* External functions read input parameters directly from \`calldata\` (which is read-only and cheap). Public functions must copy array parameters into \`memory\` to support internal calls, which costs extra gas.
* **Explain how msg.sender and tx.origin differ.**
  *   *Answer:* \`msg.sender\` is the direct caller of the function. \`tx.origin\` is the original Externally Owned Account (EOA) that initiated the transaction. Using \`tx.origin\` for authorization is a security risk, as it makes the contract vulnerable to phishing attacks.

#### Summary:
Solidity functions use mutability and visibility keywords to control data access and gas. Custom modifiers allow developers to write clean, reusable access rules.
            `,
            exercise: "Write a modifier called 'onlyAfter' that takes a timestamp input parameter and restricts a function from running until that time has passed."
          },
          {
            id: "bc-l-3-3",
            title: "Dynamic Mappings, Arrays & Structs",
            time: "55 min",
            summary: "Complex data structures in Solidity, gas optimization techniques, and mapping lookup mechanics.",
            content: `
### Dynamic Mappings, Arrays & Structs

For complex records, Solidity supports custom **Structs**, dynamic/fixed **Arrays**, and key-value **Mappings**.

#### Structs & Arrays:
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StructsAndArrays {
    struct Student {
        string name;
        uint256 grade;
    }

    Student[] public students; // Dynamic array

    function addStudent(string memory _name, uint256 _grade) public {
        students.push(Student(_name, _grade));
    }
}
\`\`\`

#### Mappings:
Mappings act as hash tables. They link keys to values:
\`\`\`solidity
contract Ledger {
    // Maps addresses to balances:
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
}
\`\`\`
Note: Mappings cannot be iterated over. If you need to list keys, you must store keys in an array separately.

#### Quiz Questions:
1. **Can you iterate over keys in a mapping directly?**
   *   a) Yes, using a standard 'for' loop
   *   b) No, mappings have no index lists (Correct)
2. **Which keyword allocates a temporary array in memory that disappears after function execution?**
   *   a) storage
   *   b) memory (Correct)
   *   c) calldata

#### Interview Questions:
* **How are mapping lookups implemented in the EVM?**
  *   *Answer:* In the EVM, mapping keys are hashed using Keccak-256 alongside the mapping's storage slot to calculate the exact storage address of the value. Because of this, mapping lookups have a constant O(1) gas complexity.
* **Why should you avoid looping over large dynamic arrays in production smart contracts?**
  *   *Answer:* If the array grows too large, the gas cost of looping through all elements will exceed the block gas limit, causing the transaction to revert permanently and locking contract functionality.

#### Summary:
Structs and arrays model grouped parameters. Mappings link keys to values with O(1) gas cost, but require a separate array to track keys since they cannot be iterated.
            `,
            exercise: "Write a contract that keeps a registry of books using a struct (title, author, isAvailable) mapped to unique uint IDs."
          },
          {
            id: "bc-l-3-4",
            title: "Events Logging & Error Handling",
            time: "50 min",
            summary: "Emitting contract events, indexed topics, require statements, assert validation, and custom errors.",
            content: `
### Events Logging & Error Handling

Error handling and event logs ensure that transactions execute safely and notify external applications when actions occur.

#### Events:
Events write data to the EVM transaction log, which is cheaper than writing to storage. Frontends (like React websites) listen for these events:
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventLogger {
    // Up to 3 parameters can be indexed (topics) to allow filtering:
    event Transfer(address indexed from, address indexed to, uint256 amount);

    function triggerTransfer(address _to, uint256 _amount) public {
        emit Transfer(msg.sender, _to, _amount);
    }
}
\`\`\`

#### Error Handling (Exceptions):
Solidity has three mechanisms to validate requirements and revert execution:
1.  **require(condition, "Error Msg"):** Validates inputs. Reverts transaction and returns unused gas.
2.  **assert(condition):** Checks for internal code errors. Reverts transaction and consumes all gas.
3.  **revert CustomError():** Reverts transaction. Supports custom errors, which save gas compared to string messages.

\`\`\`solidity
error InsufficientBalance(uint256 available, uint256 required);

contract Vault {
    uint256 public balance;

    function withdraw(uint256 amount) public {
        if (amount > balance) {
            revert InsufficientBalance(balance, amount); // Gas efficient custom error
        }
        balance -= amount;
    }
}
\`\`\`

#### Quiz Questions:
1. **Why are custom errors preferred over require statement strings in modern Solidity?**
   *   a) They make code run faster
   *   b) They save gas by avoiding storing long string logs on-chain (Correct)
   *   c) They automatically restart validation
2. **What does indexing a parameter in an event do?**
   *   a) Restricts access to the event
   *   b) Allows external applications to filter event logs using it (Correct)
   *   c) Automatically double-signs the transaction

#### Interview Questions:
* **What is the difference between require() and assert() regarding gas consumption?**
  *   *Answer:* \`require()\` is used to validate inputs or runtime conditions. It returns remaining gas if the validation fails. \`assert()\` checks for invariants that should never fail. In older EVM versions, it consumed all remaining gas; in modern versions, it behaves like a panic revert, but is still reserved for internal bugs.
* **Can a smart contract read its own emitted events?**
  *   *Answer:* No. Events are write-only actions recorded in transaction logs (receipts). The EVM bytecode does not have read access to transaction logs, making them accessible only to off-chain clients like frontends.

#### Summary:
Events record transaction details cheaply. Errors (require, revert, custom errors) roll back transactions and revert all state changes if validation checks fail.
            `,
            exercise: "Write a contract with a deposit function that emits a 'Deposit' event containing msg.sender, msg.value, and block.timestamp parameters."
          },
          {
            id: "bc-l-3-5",
            title: "Inheritance, Abstract Contracts & Interfaces",
            time: "55 min",
            summary: "Multiple inheritance, virtual/override function keys, abstract declarations, and interface signatures.",
            content: `
### Inheritance, Abstract Contracts & Interfaces

Solidity supports modular development through inheritance, abstract classes, and interfaces.

#### Inheritance (is):
A contract can inherit state and functions from other contracts:
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Parent {
    // Functions to be overridden must be marked 'virtual':
    function getValue() public pure virtual returns (string memory) {
        return "Parent Value";
    }
}

contract Child is Parent {
    // Overriding functions must use 'override':
    function getValue() public pure override returns (string memory) {
        return "Child Value";
    }
}
\`\`\`

#### Interfaces (interface):
Interfaces define function signatures without implementing them. They enable interaction with other deployed smart contracts:
\`\`\`solidity
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract WalletAudit {
    function getBalanceOfToken(address tokenAddress, address userAddress) public view returns (uint256) {
        // Wrap address in interface to call it:
        return IERC20(tokenAddress).balanceOf(userAddress);
    }
}
\`\`\`

#### Quiz Questions:
1. **Which keyword is required in a parent function to allow a child contract to override it?**
   *   a) override
   *   b) virtual (Correct)
   *   c) abstract
2. **Do interfaces allow defining state variables or function bodies?**
   *   a) Yes, if marked public
   *   b) No, they only contain function signatures (Correct)

#### Interview Questions:
* **How does Solidity resolve the Diamond Problem in multiple inheritance?**
  *   *Answer:* Solidity uses C3 Linearization (the reverse search path specified in the \`is\` statement). Derived contracts must list parent contracts in order from "most base-like" to "most derived-like" (e.g. \`contract C is A, B\`).
* **Why are interfaces critical for decentralization?**
  *   *Answer:* Interfaces allow developers to interact with existing protocols (like Uniswap or Chainlink) without needing their underlying code. This enables modular smart contract systems to connect dynamically.

#### Summary:
Solidity uses \`is\` to inherit contracts. Parent functions must be marked \`virtual\` and child overrides marked \`override\`. Interfaces define blueprints for contract interaction.
            `,
            exercise: "Write an interface called 'ICalculator' containing a sum function. Create a contract that implements this interface."
          },
          {
            id: "bc-l-3-6",
            title: "Ether Transfers & Fallback Routines",
            time: "50 min",
            summary: "Transfer, send, and call operators, receive() versus fallback() handlers, and reentrancy gas rules.",
            content: `
### Ether Transfers & Fallback Routines

Smart contracts can receive and send Ether (ETH). To receive Ether, a contract must have specific fallback handlers.

#### Methods to Send Ether:
1.  **transfer (2300 gas limit):** Reverts transaction if it fails.
2.  **send (2300 gas limit):** Returns a boolean indicating success. Does not revert automatically.
3.  **call (forwards all gas):** Returns a boolean and data. **Recommended** for modern Solidity.

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EtherSender {
    function sendViaCall(address payable _to) public payable {
        // Call returns success status:
        (bool success, ) = _to.call{value: msg.value}("");
        require(success, "Error: Transfer failed");
    }
}
\`\`\`

#### Methods to Receive Ether:
If a contract receives Ether without a function call, it routes to one of these special functions:
*   **receive() external payable:** Executed if the transaction data payload is empty.
*   **fallback() external payable:** Executed if transaction data is not empty or if receive() is missing.

\`\`\`solidity
contract EtherReceiver {
    event Received(address caller, uint256 amount);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
\`\`\`

#### Quiz Questions:
1. **Which method is recommended for sending Ether to other contracts in modern Solidity?**
   *   a) transfer
   *   b) call (Correct)
   *   c) send
2. **When is the fallback() function triggered?**
   *   a) When a transaction is cancelled
   *   b) When no other function name matches the transaction data sent (Correct)
   *   c) When the gas limit is exceeded

#### Interview Questions:
* **Why is call() preferred over transfer() for sending Ether, and what security risk does it introduce?**
  *   *Answer:* \`transfer()\` is limited to 2300 gas. While this prevents reentrancy, it can cause transfers to fail if the receiving wallet is a multi-signature smart contract that requires more gas to run its code. \`call()\` forwards all gas, solving this issue, but introduces **Reentrancy** risks if not secured properly.
* **Explain the difference between receive() and fallback().**
  *   *Answer:* \`receive()\` is triggered only when the transaction data is empty (just Ether is sent). \`fallback()\` is triggered when the transaction data is not empty, or when a function call is made to a function that does not exist.

#### Summary:
ETH can be sent via transfer, send, or call. Call is the standard for modern Solidity. Receiving contracts use receive() or fallback() to capture transfers.
            `,
            exercise: "Build a contract that receives Ether via receive() and implements a withdraw function using call() to send all funds back to the deployer."
          }
        ]
      },
      {
        id: "bc-m-4",
        title: "Module 4: Production Tokens, Security & Ethers.js",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Explain ERC-20 fungible and ERC-721 non-fungible tokens standards",
          "Identify reentrancy vulnerabilities and apply lock guard modifiers",
          "Integrate frontend apps to blockchains using Ethers.js",
          "Analyze Layer 2 rollups and scaling mechanisms"
        ],
        lessons: [
          {
            id: "bc-l-4-1",
            title: "Token Standards: ERC-20 & ERC-721",
            time: "55 min",
            summary: "Fungible tokens, non-fungible tokens (NFTs), metadata, and OpenZeppelin library compilation.",
            content: `
### Token Standards: ERC-20 & ERC-721

Token standards ensure that tokens behave consistently, allowing them to integrate with decentralised exchanges (DEXs) and wallets (like MetaMask).

#### 1. ERC-20 (Fungible Tokens):
Fungible tokens are identical and divisible. Each unit has the same value (like US dollars or Bitcoin).
*   **Key Functions:** \`totalSupply()\`, \`balanceOf()\`, \`transfer()\`, \`approve()\`, \`transferFrom()\`.

#### 2. ERC-721 (Non-Fungible Tokens - NFTs):
Each token is unique and indivisible. Used to represent digital art, certificates, or real estate.
*   **Key Functions:** \`ownerOf()\`, \`safeTransferFrom()\`.

#### ERC-20 Contract using OpenZeppelin:
\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("SynapseToken", "SYN") {
        // Mint 1 million tokens (with 18 decimals):
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
\`\`\`

#### Quiz Questions:
1. **Which standard is used to create unique digital collectibles (NFTs)?**
   *   a) ERC-20
   *   b) ERC-721 (Correct)
   *   c) ERC-1155
2. **What does the approve() function do in the ERC-20 standard?**
   *   a) Mint new tokens
   *   b) Delete a wallet address
   *   c) Authorize a third-party contract to spend a specific amount of tokens on your behalf (Correct)

#### Interview Questions:
* **Explain how approval workflows protect users in decentralized exchanges.**
  *   *Answer:* Instead of sending tokens directly to a DEX contract, the user calls \`approve()\` to allow the DEX contract to transfer a specific number of tokens. The DEX then executes \`transferFrom()\` to complete the swap. This ensures that the DEX cannot withdraw more than the authorized limit.
* **What is the difference between ERC-721 and ERC-1155?**
  *   *Answer:* ERC-721 requires deploying a separate contract state for each unique token category. ERC-1155 is a multi-token standard that allows a single contract to represent fungible, semi-fungible, and non-fungible tokens together, saving gas during deployment.

#### Summary:
ERC-20 defines standard APIs for fungible tokens, while ERC-721 defines non-fungible collectibles. OpenZeppelin libraries simplify importing these secure standards.
            `,
            exercise: "Write a simple ERC-721 NFT contract using OpenZeppelin template paths and specify a public mint function."
          },
          {
            id: "bc-l-4-2",
            title: "Smart Contract Vulnerability: Reentrancy",
            time: "55 min",
            summary: "Analyzing the DAO hack, tracing recursion exploits, and implementing the Checks-Effects-Interactions pattern.",
            content: `
### Smart Contract Vulnerability: Reentrancy

Reentrancy is one of the most critical security vulnerabilities in smart contracts. It occurs when a contract sends Ether to an untrusted contract *before* updating its state (such as the user's balance).

#### How the Exploit Works:
1.  **Withdraw Request:** Victim contract checks if attacker has a balance.
2.  **Ether Send:** Victim contract sends Ether to attacker.
3.  **Fallback Trigger:** Attacker's contract has a custom fallback/receive function that calls the withdraw function *again* before the balance is updated.
4.  **Looping:** The victim contract checks the balance again (which hasn't changed yet), sends more Ether, and the loop repeats until the contract is drained.

#### Vulnerable Code Example:
\`\`\`solidity
// VULNERABLE CONTRACT
contract VulnerableVault {
    mapping(address => uint256) public balances;

    function withdraw() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0);

        (bool success, ) = msg.sender.call{value: balance}(""); // State is not updated yet!
        require(success);

        balances[msg.sender] = 0; // State is updated too late!
        // Attacker can trigger fallback and call withdraw again before this line executes
    }
}
\`\`\`

#### Secure Code (Checks-Effects-Interactions Pattern):
\`\`\`solidity
// SECURED CONTRACT
contract SecureVault {
    mapping(address => uint256) public balances;

    function withdraw() public {
        // 1. Checks: Validate requirements
        uint256 balance = balances[msg.sender];
        require(balance > 0);

        // 2. Effects: Update state variables
        balances[msg.sender] = 0;

        // 3. Interactions: External calls
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success);
    }
}
\`\`\`
Alternatively, use OpenZeppelin's \`ReentrancyGuard\` and apply the \`nonReentrant\` modifier.

#### Quiz Questions:
1. **What is the primary cause of a reentrancy vulnerability?**
   *   a) Compiler syntax bugs
   *   b) Making external calls before updating local contract state variables (Correct)
   *   c) Charging too much gas fee
2. **Which pattern is used to structure functions to prevent reentrancy?**
   *   a) Intercept-Verify-Log
   *   b) Checks-Effects-Interactions (Correct)
   *   c) Loop-Update-Execute

#### Interview Questions:
* **Explain the DAO Hack of 2016 and its historical impact on Ethereum.**
  *   *Answer:* An attacker exploited a reentrancy bug in the DAO smart contract, draining 3.6 million Ether. This led to a contentious hard fork, splitting the network into Ethereum (which rolled back the hack) and Ethereum Classic (which preserved the original blockchain ledger).
* **How does a reentrancy guard modifier work under the hood?**
  *   *Answer:* It uses a state boolean (e.g. \`status = LOCKED/UNLOCKED\`). The modifier checks if the status is unlocked, sets it to locked, runs the function, and sets it back to unlocked on completion. Any recursive call while locked will revert.

#### Summary:
Reentrancy occurs when external calls trigger recursive functions before state variables update. It is prevented using the Checks-Effects-Interactions pattern or reentrancy guards.
            `,
            exercise: "Write a mock attacker contract that targets the VulnerableVault using a custom receive fallback method to drain its funds."
          },
          {
            id: "bc-l-4-3",
            title: "Connecting to Web3: Web3.js & Ethers.js",
            time: "55 min",
            summary: "Providers, signers, JSON-RPC queries, ABI wrappers, and connecting frontends to smart contracts.",
            content: `
### Connecting to Web3: Web3.js & Ethers.js

To connect standard web pages (React, HTML) to smart contracts, developers use client libraries like **Ethers.js** or **Web3.js**. These libraries communicate with blockchain nodes using JSON-RPC protocols.

#### Key Ethers.js Concepts:
1.  **Provider:** A read-only connection to the blockchain network.
2.  **Signer:** An abstraction of an Ethereum wallet, used to sign transactions and write to contracts.
3.  **Contract Object:** An instance wrapping the contract's deployed **Address** and **ABI (Application Binary Interface)**, allowing developers to call Solidity functions as JS methods.

#### Ethers.js Integration Code:
\`\`\`javascript
import { ethers } from "ethers";

// ABI defines the functions and signatures available in the contract:
const abi = [
  "function get() public view returns (uint256)",
  "function set(uint256 x) public"
];
const contractAddress = "0x9F...3f";

async function interactWithContract() {
  // Connect to MetaMask provider:
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Request account access:
  const signer = await provider.getSigner();
  
  // Initialize contract object:
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Call view function (read-only):
  const val = await contract.get();
  console.log("Stored value:", val.toString());

  // Send transaction (writes to blockchain):
  const tx = await contract.set(42);
  await tx.wait(); // Wait for block confirmation
  console.log("Transaction confirmed!");
}
\`\`\`

#### Quiz Questions:
1. **What is a Provider in Ethers.js?**
   *   a) A wallet private key
   *   b) A read-only interface to query the blockchain network (Correct)
   *   c) A deployment server
2. **What does ABI stand for?**
   *   a) Automated Block Integration
   *   b) Application Binary Interface (Correct)
   *   c) Asymmetric Bit Index

#### Interview Questions:
* **Why do Ethers.js write functions require waiting for tx.wait() to resolve?**
  *   *Answer:* When you call a state-changing function, Ethers.js submits a transaction to the network mempool. \`tx.wait()\` pauses execution until a miner includes the transaction in a block, confirming that the state has been updated.
* **Explain MetaMask's role as a provider injection tool in modern browsers.**
  *   *Answer:* MetaMask injects a global object \`window.ethereum\` into web pages. This object wraps a JSON-RPC gateway provider and acts as a secure keystore, allowing users to sign transactions without exposing their private keys.

#### Summary:
Ethers.js and Web3.js connect frontends to blockchains. Providers read ledger data, while signers authenticate state changes. ABIs map binary contracts to JS calls.
            `,
            exercise: "Write a JavaScript code snippet that checks if MetaMask is installed in the browser and requests the user's wallet address."
          },
          {
            id: "bc-l-4-4",
            title: "Layer 2 Scaling Solutions",
            time: "50 min",
            summary: "Blockchain trilemma, rollups, sidechains, sharding, and Zero-Knowledge proofs scaling.",
            content: `
### Layer 2 Scaling Solutions

Blockchains face the **Blockchain Trilemma**: the difficulty of achieving Decentralization, Security, and Scalability simultaneously. Layer 2 scaling solutions help by processing transactions off-chain to keep fees low while relying on Layer 1 for security.

#### Types of Scaling:
1.  **Sidechains:** Independent blockchains running in parallel to Layer 1, linked by a two-way bridge (e.g. Polygon PoS). They have their own consensus and security models.
2.  **Rollups:** Process transactions off-chain, bundle them, and submit the transaction data to Layer 1.
    *   **Optimistic Rollups (e.g. Arbitrum, Optimism):** Assume transactions are valid by default. Validators can submit **Fraud Proofs** within a 7-day challenge window to dispute fraud.
    *   **Zero-Knowledge (ZK) Rollups (e.g. zkSync, Starknet):** Process transactions off-chain and submit a **Validity Proof** (ZK-SNARK/STARK) to Layer 1, guaranteeing validity instantly.

#### Rollups Comparison:
| Type | Challenge Window | Validity Verification | Security Level |
| :--- | :--- | :--- | :--- |
| **Optimistic** | 7 Days | Disputed via Fraud Proofs | High |
| **ZK Rollup** | None (Instant) | Cryptographic Validity Proofs | Maximum |

#### Quiz Questions:
1. **What is the Blockchain Trilemma?**
   *   a) Speed, throughput, and size
   *   b) Security, decentralization, and scalability (Correct)
   *   c) Nodes, miners, and validators
2. **Which Layer 2 rollup uses mathematical validity proofs to verify transactions instantly?**
   *   a) Optimistic Rollups
   *   b) ZK Rollups (Correct)
   *   c) Sidechains

#### Interview Questions:
* **How do Rollups inherit the security of the Ethereum Layer 1 chain?**
  *   *Answer:* Rollups compress transaction data and publish it to the Layer 1 chain as \`calldata\`. Because the history of transactions is recorded on Layer 1, anyone can reconstruct the rollup state, ensuring security is backed by the mainnet.
* **Why do optimistic rollups have a 7-day withdrawal window?**
  *   *Answer:* Optimistic rollups assume transactions are correct by default. The 7-day window allows validators to detect fraud, compute state transitions, and submit fraud proofs to dispute malicious updates.

#### Summary:
Layer 2 scaling helps blockchains scale without sacrificing security. Rollups batch transactions off-chain and record data on Layer 1, utilizing either optimistic fraud proofs or ZK validity proofs.
            `,
            exercise: "Research the differences between Polygon PoS (sidechain) and Polygon zkEVM (ZK Rollup) and write a comparative summary."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Blockchain Reference Portals",
    items: [
      { name: "Solidity Reference Manual", desc: "Official language specifications, guides and updates.", link: "https://docs.soliditylang.org" },
      { name: "Remix Integrated IDE", desc: "Web compiler and deployment tool for writing smart contracts.", link: "https://remix.ethereum.org" },
      { name: "OpenZeppelin Contracts Library", desc: "Secure implementations of ERC-20, ERC-721, and other token standards.", link: "https://openzeppelin.com/contracts" },
      { name: "Ethers.js v6 documentation", desc: "API reference for connecting JavaScript frontends to Ethereum nodes.", link: "https://docs.ethers.org" }
    ]
  }
];

export const glossary = [
  { term: "Blockchain", def: "A decentralized peer-to-peer ledger securing records cryptographically in chained blocks." },
  { term: "Cryptographic Hash", def: "A deterministic, one-way algorithm turning any data size into a unique fixed-length string." },
  { term: "Merkle Tree", def: "A hash tree summarizing all block transactions into a single Merkle Root for instant audit verification." },
  { term: "Consensus Mechanism", def: "A protocol (e.g. PoW, PoS) enabling distributed untrusted nodes to agree on a single database state." },
  { term: "EVM", def: "Ethereum Virtual Machine - the global runtime executing compiled smart contract bytecode instructions." },
  { term: "Solidity", def: "A statically-typed, object-oriented programming language designed for writing smart contracts." },
  { term: "Access Modifier", def: "A reusable validation wrapper checking conditions before executing function statements." },
  { term: "Checks-Effects-Interactions", def: "A design pattern preventing reentrancy vulnerabilities by updating contract state variables before making external calls." },
  { term: "ABI", def: "Application Binary Interface - a JSON schema mapping binary contract bytecode to JavaScript execution formats." },
  { term: "Rollup", def: "A Layer 2 scaling strategy bundling transactions off-chain and posting aggregated transaction data to Layer 1." }
];
