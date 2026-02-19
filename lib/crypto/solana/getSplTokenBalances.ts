import { PublicKey } from "@solana/web3.js";
import { connection } from "./connection";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function getSplTokenBalances(address: string) {
  const pubKey = new PublicKey(address);

  const accounts = await connection.getParsedTokenAccountsByOwner(
    pubKey,
    { programId: TOKEN_PROGRAM_ID }
  );

  const splTokenBalances = accounts.value.map((account) => {
    const info = account.account.data.parsed.info;

    return {
      mint: info.mint,
      balance: info.tokenAmount.uiAmount,
      decimals: info.tokenAmount.decimals,
    };
  });

  return splTokenBalances;
}
