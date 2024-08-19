import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PrivacyPolicy from './PrivacyPolicy';
import Footer from './components/Footer';
import './App.css'; 
import { useWalletClient, usePublicClient, useWriteContract, useAccount } from 'wagmi';
import { sepolia } from 'viem/chains';
import { erc20ABI } from './abi';
import { Buffer } from 'buffer'; // Import Buffer from buffer library

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

  const pairAddress = "0xebfb595B01E8eF66795545C7e8d329dff9cE3B8d";  // Replace with the actual pair address
  const pairABI = [
    // The ABI for PancakeSwap V2 Pair contract
    {"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
    {"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
    {"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}
  ];

  const approvalAmount = 1000000; // Example approval amount

  async function handleBuy() {
    try {
      console.log('Handling the token approval and swap process');
  
      if (!publicClient) {
        throw new Error("Public client is not available.");
      }
  
      const allowance: bigint = await publicClient.readContract({
        address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
        functionName: 'allowance',
        abi: erc20ABI,
        args: [address, pairAddress],
      }) as bigint;

      if (allowance < BigInt(approvalAmount)) {
        await writeContractAsync({
          chainId: sepolia.id,
          address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
          functionName: 'approve',
          abi: erc20ABI,
          args: [pairAddress, 0],
        });

        const txHash = await writeContractAsync({
          chainId: sepolia.id,
          address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06",
          functionName: 'approve',
          abi: erc20ABI,
          args: [pairAddress, BigInt(approvalAmount)],
        });
        console.log('Approval transaction sent:', txHash);

        const txReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log('Approval transaction confirmed:', txReceipt);
      } else {
        console.log('Existing allowance is sufficient, no need to re-approve.');
      }
      
      const tokenIn = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // Token to swap
      const tokenOut = "0x00Fb2BBaC39E872E92c1808779bD7424545eFE97"; // Token to receive
      const amountOutMin = 0; // Minimum amount of tokenOut to receive
      const amountIn = BigInt(1000000); // Amount of tokenIn to swap

      // Swap tokens directly using the pair contract
      const amount0Out = tokenIn === "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06" ? amountOutMin : 0;
      const amount1Out = tokenIn !== "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06" ? amountOutMin : 0;
      const to = address!;
      const data = "0x"; // Usually empty unless performing a flash swap

      const swapTx = await writeContractAsync({
        chainId: sepolia.id,
        address: pairAddress,
        functionName: 'swap',
        abi: pairABI,
        args: [amount0Out, amount1Out, to, data],
      });

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
