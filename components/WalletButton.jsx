"use client";

import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function ConnectWalletButton() {
  const wallet = useWallet();

  const connectWallet = async () => {
    try {
      await wallet.connect();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return <WalletMultiButton onClick={connectWallet} />;
}


