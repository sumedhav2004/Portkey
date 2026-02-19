import { Connection } from "@solana/web3.js";

const url = process.env.NEXT_PUBLIC_DEV_URL;

if (!url) {
  throw new Error("Missing NEXT_PUBLIC_DEV_URL");
}

export const connection = new Connection(url);
