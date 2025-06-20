const { expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting, owner, voters, others;

  beforeEach(async () => {
    [owner, ...addrs] = await ethers.getSigners();
    voters = addrs.slice(0, 5);      // İlk 5 kişi seçmen
    others = addrs.slice(5);         // Diğerleri seçmen değil

    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(voters.map(v => v.address));
    await voting.waitForDeployment();

    await voting.connect(owner).addCandidate("Aday 1");
    await voting.connect(owner).addCandidate("Aday 2");
  });

  it("sahibi doğru atanmalı", async () => {
    expect(await voting.owner()).to.equal(owner.address);
  });

  it("seçmen oy kullanabilmeli", async () => {
    await voting.connect(voters[0]).vote(1);
    const results = await voting.getResults();
    expect(Number(results[0].voteCount)).to.equal(0); // Aday 1
    expect(Number(results[1].voteCount)).to.equal(1); // Aday 2
  });

  it("seçmen olmayan oy kullanamamalı", async () => {
    await expect(voting.connect(others[0]).vote(0))
      .to.be.revertedWith("Oy kullanma yetkiniz yok");
  });

  it("aynı kişi iki kez oy kullanamamalı", async () => {
    await voting.connect(voters[0]).vote(0);
    await expect(voting.connect(voters[0]).vote(1))
      .to.be.revertedWith("Zaten oy kullandiniz");
  });

  it("oylar doğru sayılmalı", async () => {
    await voting.connect(voters[0]).vote(1);
    await voting.connect(voters[1]).vote(1);
    const results = await voting.getResults();
    expect(Number(results[1].voteCount)).to.equal(2); // Aday 2
  });

  it("sadece sahibi oylamayı bitirebilmeli", async () => {
    await expect(voting.connect(voters[0]).endVoting())
      .to.be.revertedWith("Sadece sahibi yapabilir");

    await voting.connect(owner).endVoting();
    expect(await voting.votingOpen()).to.equal(false);
  });

  it("oylama bittikten sonra oy kullanılamamalı", async () => {
    await voting.connect(owner).endVoting();
    await expect(voting.connect(voters[0]).vote(0))
      .to.be.revertedWith("Oylama kapali");
  });

  it("adaylar doğru şekilde eklenmiş olmalı", async () => {
    const results = await voting.getResults();
    expect(results.length).to.equal(2);
    expect(results[0].name).to.equal("Aday 1");
    expect(results[1].name).to.equal("Aday 2");
  });
});
