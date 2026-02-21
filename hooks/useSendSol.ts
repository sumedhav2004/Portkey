import { useState, useCallback } from "react";
import { sendSol } from "@/lib/crypto/solana/sendSol";
import { Keypair } from "@solana/web3.js";

export function useSendSol() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const send = useCallback(
    async (fromKeypair: Keypair, toAddress: string, amount: number) => {
      try {
        setLoading(true);
        setError(null);
        setSignature(null);

        const sig = await sendSol(fromKeypair, toAddress, amount);
        setSignature(sig);
        console.log(signature)
        return sig;
      } catch (err: any) {
        setError(err.message || "Transaction failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  return { send, loading, error, signature };
}
