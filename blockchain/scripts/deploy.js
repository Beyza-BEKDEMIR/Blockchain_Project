//const crypto = require('crypto');
//const bip39 = require('bip39');
const hre = require('hardhat');
const fs = require('fs');
const path = require('path');
//const { Wallet } = require('ethers');

async function main() {
  const voterAddresses = [
    "0x..........................",  //Buraya metamask adresleri eklenecek.
    '0x..........................',
    '0x..........................',
    '0x..........................',
    '0x..........................'
  ];

  // Voting contract'ını deploy et
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(voterAddresses);

  await voting.waitForDeployment();

  const contractAddress = await voting.getAddress();
  console.log(`Voting contract deployed to: ${contractAddress}`);

  await voting.addCandidate("Aday 1");
  await voting.addCandidate("Aday 2");
  console.log("Adaylar eklendi.");

  // JSON içeriği
  const addressJson = JSON.stringify({ address: contractAddress }, null, 2);

  // 1. deployedContracts klasörüne yaz
  const backendPath = path.join(__dirname, '..', 'deployedContracts', 'VotingAddress.json');
  const backendDir = path.dirname(backendPath);
  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir, { recursive: true });
  }
  fs.writeFileSync(backendPath, addressJson);
  console.log(`Address saved to backend: ${backendPath}`);

  // 2. my-voting-app/src/contract klasörüne yaz
  const frontendPath = path.join(__dirname, '..', '..', 'my-voting-app', 'src', 'contract', 'VotingAddress.json');
  const frontendDir = path.dirname(frontendPath);
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }
  fs.writeFileSync(frontendPath, addressJson);
  console.log(`Address copied to frontend: ${frontendPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

