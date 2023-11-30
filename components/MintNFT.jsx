// Import necessary libraries and components
"use client";

import React, { useEffect, useState } from "react";
import { toMetaplexFile } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMetaplex } from "@/lib/useMetaplex";

const NFTMinter = () => {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isMinting, setMinting] = useState(false);

  const { metaplex: mx } = useMetaplex();
  const wallet = useWallet();

  async function uploadNFT(walletID) {
    try {
      const raw = JSON.stringify({
        walletID: walletID,
      });

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const response = await fetch("/api/nft", {
        method: "POST",
        body: raw,
        headers: myHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      console.error("Error:", error);
      throw new Error(error);
    }
  }

  const mintNFT = async () => {
    if (!imageFile) {
      console.log("Error");
      alert("Please select an image.");
      return;
    }
    if (!title) {
      alert("Please enter a title.");
      return;
    }

    try {
      setMinting(true);

      try {
        await new Promise((resolve, reject) => {
          var reader = new FileReader();
          const fileData = new Blob([imageFile], { type: "image/png" });
          reader.readAsArrayBuffer(fileData);
          reader.onload = async () => {
            try {
              const buffer = reader.result;
              const { uri, metadata } = await mx.nfts().uploadMetadata({
                name: title,
                image: toMetaplexFile(buffer, "image/png"),
              });

              let mintAddress = "";

              const { nftMinted } = await mx
                .nfts()
                .create({
                  uri,
                  name: title,
                  sellerFeeBasisPoints: 500,
                })
                .then((data) => {
                  mintAddress = data.mintAddress.toBase58();
                  console.log(data);
                  return data;
                });

              resolve(nftMinted);

              console.log("MintedAddress : ", mintAddress);

              try {
                await uploadNFT(wallet.publicKey.toBase58());
                // console.log(response);
              } catch (error) {
                console.error("Error uploading NFT:", error);
                reject(error);
              }
            } catch (error) {
              console.error("Error minting NFT:", error);
              reject(error);
            }
          };
        });
      } catch (error) {
        console.error("Error minting NFT:", error);
        alert("Error minting NFT. Please try again later.");
      }
      setTitle("");
      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Error minting NFT. Please try again later.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-md">
      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Title
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Title"
        required
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />

      <label
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Upload file
      </label>
      <input
        className="block w-full text-sm p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        type="file"
        onChange={(e) => {
          setImageFile(e.target.files[0]);
        }}
        accept="image/*"
      />
      <button
        className={`col-span-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          isMinting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={mintNFT}
        disabled={isMinting}
      >
        {isMinting ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
};

export default NFTMinter;
