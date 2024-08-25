import React from 'react';

interface NFTMintedPopupProps {
  onClose: () => void;
}

function NFTMintedPopup({ onClose }: NFTMintedPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">NFT Minted Successfully!</h2>
        <div className="flex justify-center mb-4">
          <img src={`${process.env.PUBLIC_URL}/warrior.png`} alt="Warrior NFT" className="w-64 h-64 object-contain" />
        </div>
        <p className="text-center mb-4">Congratulations! You've minted a Warrior NFT.</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NFTMintedPopup;