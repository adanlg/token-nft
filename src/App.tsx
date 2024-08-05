import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './App.css';  // Import the CSS file



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

function App() {
  return (
    <div className="App min-h-screen font-sans bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
      <header className="flex items-center justify-center py-9 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent">
        <CustomConnectButton />
      </header>
      <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-transparent via-blue-900 to-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-white flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Top G token</h1>
            <p className="text-lg text-center md:text-left">
              Este es un ejemplo de una landing page usando React y Tailwind CSS. 
              Puedes agregar más contenido aquí para describir tu producto o servicio.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <button className="bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Buy
              </button>
              <button className="bg-gradient-to-bl from-green-300 via-blue-500 to-purple-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Sell
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img src={`${process.env.PUBLIC_URL}/andrewToken.png`} alt="Example" className="w-full max-w-md" />
          </div>
        </div>
        <section className="flex items-center justify-center h-64 text-white">
          <p className="text-2xl">Let's see the level of G you are...</p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-8">
          <div className="flex items-center justify-center">
            <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
              <div className="card-inner h-full w-full p-8 flex items-center justify-center ">
                <div className='text-white font-bold text-2xl absolute top-2 left-2'> NFT Card</div>
               
              <img src={`${process.env.PUBLIC_URL}/topg.webp`} alt="Example" className="w-1/2 h-1/ max-w-md pb-3" />              </div>
            </div>

          </div>    
          {/* <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
              <div className="card-inner h-full w-full p-8 flex items-center justify-center ">
                <div className='text-white font-bold text-2xl absolute top-2 left-2'> NFT Card</div>
               
              <img src={`${process.env.PUBLIC_URL}/catowner2bg.png`} alt="Example" className="w-1/2 h-1/ max-w-md pb-3" />              </div>
            </div>   */}
          <div className="text-white flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Depending on which price you sell your tokens, you will receive one NFT</h1>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-4xl mx-auto py-8">
          <div className="flex items-center justify-center">
          <div className='text-white text-center'>

            <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
              <div className="card-inner h-full w-full p-8 flex items-center justify-center ">
                <div className='text-white font-bold text-2xl absolute top-2 left-2'> NFT Card</div>
               
              <img src={`${process.env.PUBLIC_URL}/topg.webp`} alt="Example" className="w-1/2 h-1/ max-w-md pb-3" />              </div>
            </div>
            Top G
          </div>  
          </div>    
  
          <div className='text-white text-center'>
                             <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
              <div className="card-inner h-full w-full p-8 flex items-center justify-center ">
                <div className='text-white font-bold text-2xl absolute top-2 left-2'> NFT Card</div>
               
              <img src={`${process.env.PUBLIC_URL}/warrior.png`} alt="Example" className="w-1/2 h-1/ max-w-md pb-3" />              </div>
            </div>  Warrior
            </div>
            
            <div className='text-white text-center'>
                             <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
              <div className="card-inner h-full w-full p-8 flex items-center justify-center ">
                <div className='text-white font-bold text-2xl absolute top-2 left-2'> NFT Card</div>
               
              <img src={`${process.env.PUBLIC_URL}/eminen.png`} alt="Example" className="w-1/2 h-1/ max-w-md pb-3" />              </div>
            </div>  Eminen Fan
            </div>
            <div className='text-white text-center'>
                             <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
              <div className="card-inner h-full w-full p-8 flex items-center justify-center ">
                <div className='text-white font-bold text-2xl absolute top-2 left-2'> NFT Card</div>
               
              <img src={`${process.env.PUBLIC_URL}/catowner2bg.png`} alt="Example" className="w-1/2 h-1/ max-w-md pb-3" />              </div>
            </div>  Catowner
            </div>





            <div className='text-white text-center'>
                             <div className="card bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600 w-full max-w-md h-64 shadow-lg transform transition-transform hover:rotate-3 hover:scale-105">
              <div className="card-inner h-full w-full p-8 flex items-center justify-center ">
                <div className='text-white font-bold text-2xl absolute top-2 left-2'> NFT Card</div>
               
              <img src={`${process.env.PUBLIC_URL}/vegan.png`} alt="Example" className="w-1/2 h-1/ max-w-md pb-3" />              </div>
            </div>  Vegan
            </div>
        </section>

      </main>
    </div>
  );
}

export default App;
