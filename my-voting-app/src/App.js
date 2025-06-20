import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "./utils/config";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [votes, setVotes] = useState([0, 0]);
  const [votingOpen, setVotingOpen] = useState(true);
  const [owner, setOwner] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const prov = new ethers.BrowserProvider(window.ethereum);
          setProvider(prov);

          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          const signerTmp = await prov.getSigner();
          setSigner(signerTmp);

          const electionContract = new ethers.Contract(contractAddress, contractABI, signerTmp);
          setContract(electionContract);

          const ownerAddress = await electionContract.owner();
          setOwner(ownerAddress);

          const open = await electionContract.votingOpen();
          setVotingOpen(Boolean(open));

          const results = await electionContract.getResults();
          setVotes(results.map(v => Number(v.voteCount)));

          electionContract.on("VoteCast", async () => {
            const res = await electionContract.getResults();
            setVotes(res.map(v => Number(v.voteCount)));
          });

          electionContract.on("VotingEnded", async () => {
            const openNow = await electionContract.votingOpen();
            setVotingOpen(openNow);
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        setStatus("Lütfen Metamask kurun!");
      }
    };

    init();

    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        setStatus("");

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const prov = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await prov.getSigner(accounts[0]);
          setSigner(newSigner);
          const electionContract = new ethers.Contract(contractAddress, contractABI, newSigner);
          setContract(electionContract);

          const open = await electionContract.votingOpen();
          setVotingOpen(Boolean(open));

          const results = await electionContract.getResults();
          setVotes(results.map(v => Number(v.voteCount)));
        } else {
          setAccount(null);
          setSigner(null);
          setContract(null);
          setVotes([0, 0]);
          setVotingOpen(false);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const vote = async (candidate) => {
  if (!contract) return;

  try {
    const tx = await contract.vote(candidate);
    await tx.wait();

    const results = await contract.getResults();
    setVotes(results.map(v => Number(v.voteCount)));

    setStatus(""); // Hata yoksa ekranda mesaj göstermeyiz
  } catch (err) {
    console.error(err);

    const reason = err.reason || err.data?.message || err.error?.message || err.message || "Bilinmeyen hata";
    
    // Sözleşmeden gelen hatayı ekranda göster
    setStatus(reason);
    }
  };


  const endVoting = async () => {
    if (!contract) return;

    try {
      const tx = await contract.endVoting();
      await tx.wait();

      const open = await contract.votingOpen();
      setVotingOpen(open);

      setStatus("Oylama sonlandırıldı.");
    } catch (err) {
      console.error(err);
      const reason = err.reason || err.data?.message || err.error?.message || err.message || "";
      setStatus(reason);  // Hata mesajını ekranda göster
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Seçim Uygulaması</h1>

      <div style={{ margin: "20px 0" }}>
        <div style={{ marginBottom: 10 }}>
          <h3>Aday 1</h3>
          <button onClick={() => vote(0)}>
            Oy Ver
          </button>
          <p>Oy Sayısı: {votes[0]}</p>
        </div>

        <div>
          <h3>Aday 2</h3>
          <button onClick={() => vote(1)}>
            Oy Ver
          </button>
          <p>Oy Sayısı: {votes[1]}</p>
        </div>
      </div>

      {votingOpen && (
        <div>
          <button onClick={endVoting} style={{ backgroundColor: "red", color: "white" }}>Oylamayı Sonlandır</button>
        </div>
      )}

      {status && <p style={{ marginTop: 20, minHeight: 30 }}>{status}</p>}
    </div>
  );
}

export default App;
