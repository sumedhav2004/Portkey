import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { connection } from "./connection";

export async function getSolBalance(address: string): Promise<number>{

  const publicKey = new PublicKey(address);

  const balance = await connection.getBalance(publicKey);
  console.log("RAW LAMPORTS ", balance)

  return balance/LAMPORTS_PER_SOL
}
