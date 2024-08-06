import React from 'react';

function PrivacyPolicy() {
    return (
        <div className="legal-advice-container p-8 text-white text-center">
          <div className="legal-advice-title text-2xl md:text-3xl mb-6"> {/* Larger text on md screens */}
            <h1>Legal Advice</h1>
          </div>
          <div className="legal-advice-image mb-8"> {/* Increased margin below image */}
            {/* Replace 'legal2.png' with the actual path to your legal-themed image */}
            <img src={`${process.env.PUBLIC_URL}/legal2.png`} alt="Legal Icon" className="mx-auto w-64 md:w-96 h-auto" /> {/* Larger image size, especially on md screens */}
          </div>
          <div className="legal-advice-content space-y-6 text-lg md:text-xl"> {/* Increased text size and spacing between paragraphs */}
            <p>
              This page provides legal information and disclaimers concerning the use of this website and its services.
              Please note that the information provided here does not constitute financial advice, legal advice, or any other
              type of professional advice. We do not represent that the information provided is accurate, complete, or current.
              The use of this website and its services is at your own risk.
            </p>
            <p>
              The tokens and associated NFT utilities provided through our platform are for utility and collectible purposes only.
              They are not investments, and no action should be taken based on the content of this website. We are not responsible
              for any financial losses or damages. Before making any financial decisions, we strongly recommend consulting with
              a qualified professional.
            </p>
            <p>
              By using this site, you acknowledge and agree that we are not liable for any decisions or actions you take based on
              any information provided on this website.
            </p>
          </div>
        </div>
      );
    }
export default PrivacyPolicy;
