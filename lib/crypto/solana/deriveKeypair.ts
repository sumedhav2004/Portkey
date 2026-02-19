import { derivePath } from "ed25519-hd-key"
import { Keypair } from "@solana/web3.js"

export function deriveSolanaKeyPair(seed: Buffer,index : number = 0):Keypair{
  const path = `m/44'/501'/${index}'/0'`;
  const derivedSeed = derivePath(path, seed.toString("hex"))
  return Keypair.fromSeed(derivedSeed.key)
}