import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PrivacyPolicy from './PrivacyPolicy';
import Footer from './components/Footer';
import './App.css'; 
import { useWalletClient, usePublicClient, useWriteContract, useAccount } from 'wagmi';
import { sepolia } from 'viem/chains';
import { erc20ABI } from './abi';

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
  // Only render header if not on the Privacy Policy page
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
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  const routerAddress = "0x55D32fa7Da7290838347bc97cb7fAD4992672255";  // replace with PancakeSwap Router V2 address on Sepolia
  const routerABI = [
    {
      "inputs": [
        { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
        { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
        { "internalType": "address[]", "name": "path", "type": "address[]" },
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "deadline", "type": "uint256" }
      ],
      "name": "swapExactTokensForTokens",
      "outputs": [
        { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const approvalAmount = 1000000; // Example approval amount

  async function handleBuy() {
    try {
      console.log('Handling the token approval and swap process');

      // Ensure the publicClient is defined before proceeding
      if (!publicClient) {
        throw new Error("Public client is not available.");
      }

      // Approve the tokens
      const txHash = await writeContractAsync({
        chainId: sepolia.id,
        address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
        functionName: 'approve',
        abi: erc20ABI,
        args: [routerAddress, approvalAmount],
      }) as `0x${string}`; // Ensure txHash is properly typed
      console.log('Approval transaction sent:', txHash);

      const txReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      console.log('Approval transaction confirmed:', txReceipt);

      // Define the tokens and amounts
      const tokenIn = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // Token to swap
      const tokenOut = "0x00Fb2BBaC39E872E92c1808779bD7424545eFE97"; // Token to receive
      const amountIn = "1000000"; // Amount of tokenIn to swap
      const amountOutMin = 0; // Minimum amount of tokenOut to receive
      const path = [tokenIn, tokenOut];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      // Execute the swap
      const swapTx = await writeContractAsync({
        chainId: sepolia.id,
        address: routerAddress,
        functionName: 'swapExactTokensForTokens',
        abi: routerABI,
        args: [
          amountIn,
          amountOutMin,
          path,
          address!,
          deadline,
        ],
      }) as `0x${string}`; // Ensure swapTx is properly typed

      console.log(`Swap transaction sent with hash: ${swapTx}`);
      const swapReceipt = await publicClient.waitForTransactionReceipt({ hash: swapTx });
      console.log('Swap transaction confirmed:', swapReceipt);
    } catch (error) {
      console.error("Error in handleBuy function:", error);
    }
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-transparent via-blue-900 to-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Top G token</h1>
          <p className="text-lg text-center md:text-left">
            Este es un ejemplo de una landing page usando React y Tailwind CSS. 
            Puedes agregar más contenido aquí para describir tu producto o servicio.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <button
              className="bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleBuy}
            >
              Buy
            </button>
            <button className="bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Sell
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src={`${process.env.PUBLIC_URL}/andrewToken.png`} alt="Token Example" className="w-full max-w-md" />
        </div>
      </div>
      <section className="flex items-center justify-center h-64 text-white">
        <p className="text-2xl">Let's see the level of G you are...</p>
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
    </main>
  );
}

export default App;
