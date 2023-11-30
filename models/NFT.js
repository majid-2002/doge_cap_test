import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({
  nftMint: {
    type: String,
    required: true,
  },
});

const NFT = mongoose.models.NFTModel || mongoose.model("NFTModel", nftSchema);

export default NFT;
