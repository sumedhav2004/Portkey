import { Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { connection } from "./connection";

export async function sendSol(
  fromKeypair: Keypair,
  toAddress: string,
  amountSol: number
): Promise<string>
{
  const destinationPublicKey = new PublicKey(toAddress);
  const amtLamports = amountSol*LAMPORTS_PER_SOL;

  const instruction = SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey: destinationPublicKey,
    lamports: amtLamports
  })

  const transaction = new Transaction()
  transaction.add(instruction)

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [fromKeypair]
  )
 
  return signature
}