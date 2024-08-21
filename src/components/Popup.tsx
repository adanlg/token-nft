import React from 'react';

interface NFTokenPopupProps {
  tokenURI: string;
  onClose: () => void;
}

const NFTokenPopup: React.FC<NFTokenPopupProps> = ({ tokenURI, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>NFT Minted Successfully!</h2>
        <img src={tokenURI} alt="Minted NFT" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NFTokenPopup;
