import { NextResponse } from "next/server";
import connectToDatabase from "../../../components/mongodb";
import NFT from "../../../models/NFT";

export async function POST(req, res) {
  try {
    await connectToDatabase();

    let passedValue = await new Response(req.body).text();
    let bodyreq = JSON.parse(passedValue);

    const { walletID } = bodyreq;

    if (!walletID) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const nft = new NFT({
      nftMint: walletID,
    });

    await nft.save();

    return new NextResponse(JSON.stringify(nft), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
      message: "Address saved successfully!",
    });
  } catch (error) {
    console.error("Error saving NFT:", error);
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const nfts = await NFT.find({});
    return new NextResponse(JSON.stringify(nfts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      message: "Addresses fetched successfully!",
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return NextResponse.error(error);
  }
}
