import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PrivacyPolicy from './PrivacyPolicy';
import Footer from './components/Footer';
import './App.css'; 
import NFTokenPopup from './components/Popup';
import NFTMintedPopup from './components/NFTMintedPopup';

import { useWalletClient, usePublicClient, useAccount, useSendTransaction } from 'wagmi';
import { abiPair, nftABI } from './abi';
import { ethers } from 'ethers';

function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}





function Header() {
  const location = useLocation();
  if (location.pathname === "/privacy-policy") {
    return null;
  }

  return (
    <header className="flex items-center justify-center py-9 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent">
      <CustomConnectButton />
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App min-h-screen font-sans bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/" element={<MainContent />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function MainContent() {
  const { data: signer } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [tokenURI, setTokenURI] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showMintedPopup, setShowMintedPopup] = useState<boolean>(false);

  const NFTAddress = "0x0a7c447FcCEED3205c23D6Bc6f3265d10Fc22723";
  const pairAddress = "0xebfb595B01E8eF66795545C7e8d329dff9cE3B8d";  // Replace with the actual pair address
  const specificAddress = "0x1166D6285a96d67eB8F9174B9A7EEc571865B87b";

  async function handleMint() {
    const mintedTokenURI = await mintNFT(address as `0x${string}`);
    if (mintedTokenURI) {
      setTokenURI(mintedTokenURI);
      setShowMintedPopup(true);
    }
  }

  function handleClosePopup() {
    setTokenURI(null);
    setShowMintedPopup(false);
  }
  async function mintNFT(toAddress: `0x${string}`): Promise<string | void> {
    try {
      const privateKey = process.env.REACT_APP_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('Private key is not defined in .env file.');
      }

      const provider = new ethers.JsonRpcProvider(`https://ethereum-sepolia-rpc.publicnode.com`);
      const wallet = new ethers.Wallet(privateKey, provider);
      const nftContract = new ethers.Contract(NFTAddress, nftABI, wallet);

      const tx = await nftContract.safeMint(toAddress);
      console.log('Mint transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Mint transaction confirmed:', receipt);

      const tokenId = 0;
      const tokenURI = await nftContract.tokenURI(tokenId);
      console.log('Minted NFT tokenURI:', tokenURI);
  
      return tokenURI;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    }
  }

  function buyClick() {
    const url = "https://pancakeswap.finance/swap?chain=sepolia&inputCurrency=0x7169D38820dfd117C3FA1f22a697dBA58d90BA06&outputCurrency=0x00Fb2BBaC39E872E92c1808779bD7424545eFE97";
    window.open(url, '_blank');
  }

  function sellClick() {
    const url = "https://pancakeswap.finance/swap?chain=sepolia&inputCurrency=0x00Fb2BBaC39E872E92c1808779bD7424545eFE97&outputCurrency=0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";
    window.open(url, '_blank');
  }

  useEffect(() => {
    if (!signer || !address || !walletClient || !publicClient) {
      console.error("Signer, address, or wallet client is not available.");
      return;
    }

    const provider = new ethers.BrowserProvider(walletClient);
    const contract = new ethers.Contract(pairAddress, abiPair, provider);

    let swapEventHandled = false;

    const listenForSwap = () => {
      contract.on('Swap', async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
        console.log('Swap event detected:', { sender, amount0In, amount1In, amount0Out, amount1Out, to });

        if (to.toLowerCase() === address.toLowerCase() && !swapEventHandled) {
          swapEventHandled = true;
          setIsLoading(true);
          const normalizedAmount0In = amount0In / BigInt(10 ** 12);
          const proportion = Number(normalizedAmount0In) / Number(amount1Out);
          try {
          if (proportion > 25) {
            console.log("Proportion is greater than 25.");
            try {
              const txResponse = await sendTransactionAsync({
                to: specificAddress,
                value: BigInt("5000000000000000"), // 0.05 Ether/MATIC in wei
              });

              console.log("Transaction sent:", txResponse);
              const receipt = await publicClient.waitForTransactionReceipt({ hash: txResponse });
              console.log("Transaction confirmed:", receipt);

              if (receipt.status === "success") {
                console.log("Transaction was successful, performing additional actions...");
                const mintedTokenURI = await mintNFT(address as `0x${string}`);
                if (mintedTokenURI) {
                  setTokenURI(mintedTokenURI);
                  setShowMintedPopup(true); // Show the popup when NFT is minted

                }
              } else {
                console.error("Transaction failed.");
              }
            } catch (error) {
              console.error("Failed to send Ether/MATIC:", error);
            }
          } else if (proportion > 5) {
            console.log("Proportion is greater than 5.");
            try {
              const txResponse = await sendTransactionAsync({
                to: specificAddress,
                value: BigInt("5000000000000000"), // 0.05 Ether/MATIC in wei
              });

              console.log("Transaction sent:", txResponse);
              const receipt = await publicClient.waitForTransactionReceipt({ hash: txResponse });
              console.log("Transaction confirmed:", receipt);

              if (receipt.status === "success") {
                console.log("Transaction was successful, performing additional actions...");
                const mintedTokenURI = await mintNFT(address as `0x${string}`);
                if (mintedTokenURI) {
                  setTokenURI(mintedTokenURI);
                  setShowMintedPopup(true); // Show the popup when NFT is minted

                }
              } else {
                console.error("Transaction failed.");
              }
            } catch (error) {
              console.error("Failed to send Ether/MATIC:", error);
            }
          }  else if (proportion > 0) {
            console.log("Proportion is greater than 0.");
            try {
              const txResponse = await sendTransactionAsync({
                to: specificAddress,
                value: BigInt("5000000000000000"), // 0.05 Ether/MATIC in wei
              });

              console.log("Transaction sent:", txResponse);
              const receipt = await publicClient.waitForTransactionReceipt({ hash: txResponse });
              console.log("Transaction confirmed:", receipt);

              if (receipt.status === "success") {
                console.log("Transaction was successful, performing additional actions...");
                const mintedTokenURI = await mintNFT(address as `0x${string}`);
                if (mintedTokenURI) {
                  setTokenURI(mintedTokenURI);
                  setShowMintedPopup(true); // Show the popup when NFT is minted

                }
              } else {
                console.error("Transaction failed.");
              }
            } catch (error) {
              console.error("Failed to send Ether/MATIC:", error);
            }
          }  else if (proportion > 0.05) {
            console.log("Proportion is greater than 0.05");
            try {
              const txResponse = await sendTransactionAsync({
                to: specificAddress,
                value: BigInt("5000000000000000"), // 0.05 Ether/MATIC in wei
              });

              console.log("Transaction sent:", txResponse);
              const receipt = await publicClient.waitForTransactionReceipt({ hash: txResponse });
              console.log("Transaction confirmed:", receipt);

              if (receipt.status === "success") {
                console.log("Transaction was successful, performing additional actions...");
                const mintedTokenURI = await mintNFT(address as `0x${string}`);
                if (mintedTokenURI) {
                  setTokenURI(mintedTokenURI);
                  setShowMintedPopup(true); // Show the popup when NFT is minted

                }
              } else {
                console.error("Transaction failed.");
              }
            } catch (error) {
              console.error("Failed to send Ether/MATIC:", error);
            }
          } else {
            console.log("Proportion is less than 0.05 ");
            try {
              const txResponse = await sendTransactionAsync({
                to: specificAddress,
                value: BigInt("5000000000000000"), // 0.05 Ether/MATIC in wei
              });

              console.log("Transaction sent:", txResponse);
              const receipt = await publicClient.waitForTransactionReceipt({ hash: txResponse });
              console.log("Transaction confirmed:", receipt);

              if (receipt.status === "success") {
                console.log("Transaction was successful, performing additional actions...");
                const mintedTokenURI = await mintNFT(address as `0x${string}`);
                if (mintedTokenURI) {
                  setTokenURI(mintedTokenURI);
                  setShowMintedPopup(true); // Show the popup when NFT is minted

                }
              } else {
                console.error("Transaction failed.");
              }
            } catch (error) {
              console.error("Failed to send Ether/MATIC:", error);
            } 
          }
          
          } finally {
            setIsLoading(false); // Stop loading indicator after transaction
          }
        }
      });
    };

    listenForSwap();

    return () => {
      contract.removeAllListeners('Swap');
    };
  }, [signer, walletClient]);


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-transparent via-blue-900 to-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Top G token</h1>
          <p className="text-lg text-center md:text-left">
            Only the real Holders will scape the matrix
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <button
              className="bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={buyClick}
            >
              Buy
            </button>
            <button className="bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={sellClick}
            >
              Sell
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src={`${process.env.PUBLIC_URL}/andrewToken.png`} alt="Token Example" className="w-full max-w-md" />
        </div>
      </div>


    {/* Loading Indicator */}
    {isLoading && (
      <div className="flex items-center justify-center mt-8">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="ml-4 text-white text-xl">Processing...</p>
      </div>
    )}

      <section className="flex items-center justify-center h-64 text-white">
      {/* Let's see the level of G you are... */}
      <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Let's see the level of G you are...</h1>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
            <div className="card-inner h-full w-full p-8 flex items-center justify-center">
              <div className="text-white font-bold text-2xl absolute top-2 left-2">NFT Card</div>
              <img src={`${process.env.PUBLIC_URL}/topg.webp`} alt="Example" className="w-1/2 h-1/ max-w-md pb-3" />
            </div>
          </div>
        </div>
        <div className="text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Depending on which price you sell your tokens, you will receive one NFT</h1>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-4xl mx-auto py-8 mt-8">
        {[
          { src: "topg.webp", label: "Top G" },
          { src: "warrior.png", label: "Warrior" },
          { src: "eminen.png", label: "Eminen Fan" },
          { src: "catowner2bg.png", label: "Cat Owner" },
          { src: "vegan.png", label: "Vegan" },
        ].map((nft, index) => (
          <div key={index} className="flex items-center justify-center">
            <div className="text-white text-center">
              <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
                <div className="card-inner h-full w-full p-8 flex items-center justify-center">
                  <div className="text-white font-bold text-2xl absolute top-2 left-2">NFT Card</div>
                  <img src={`${process.env.PUBLIC_URL}/${nft.src}`} alt={nft.label} className="w-1/2 md:w-7/8 max-w-md pb-3" />
                </div>
              </div>
              <p className="mt-2 font-bold">{nft.label}</p>
            </div>
          </div>
        ))}
      </section>
      {showMintedPopup && <NFTMintedPopup onClose={handleClosePopup} />}

    </main>
  );
}

export default App;


//chek point nft fail