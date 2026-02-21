import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { connection } from "./connection";

export async function sendSol(
  fromKeypair: Keypair,
  toAddress: string,
  amountSol: number
): Promise<string> {
  try {
    // ✅ Validate amount
    if (!amountSol || amountSol <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    // ✅ Validate address
    let destinationPublicKey: PublicKey;
    try {
      destinationPublicKey = new PublicKey(toAddress);
    } catch {
      throw new Error("Invalid recipient address");
    }

    const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

    const senderBalance = await connection.getBalance(
      fromKeypair.publicKey
    );

    const estimatedFee = 5000; 

    if (senderBalance < lamports + estimatedFee) {
      throw new Error("Insufficient balance (including fees)");
    }

    const instruction = SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: destinationPublicKey,
      lamports,
    });

    const transaction = new Transaction().add(instruction);

    const signature = await connection.sendTransaction(
      transaction,
      [fromKeypair]
    );

    await connection.confirmTransaction(signature, "finalized");

    return signature;

  } catch (error: any) {
    console.error("Transaction failed:", error.message);
    throw new Error(error.message || "Transaction failed");
  }
}
