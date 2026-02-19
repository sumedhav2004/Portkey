import { loadEncryptedMnemonic } from "@/lib/storage/walletStorage"
import { decryptMnemonic } from "@/lib/crypto/decrypt"
import { deriveSeedFromMnemonic } from "@/lib/crypto/deriveSeedFromMnemonic"
import { deriveSolanaKeyPair } from "@/lib/crypto/solana/deriveKeypair"

export async function unlockWallet(password: string) {

  // 1️⃣ Load encrypted data
  const encrypted = loadEncryptedMnemonic()

  if (!encrypted) {
    throw new Error("No wallet found")
  }

  // 2️⃣ Decrypt mnemonic
  const mnemonic = await decryptMnemonic(encrypted, password)

  // 3️⃣ Derive seed
  const seed = deriveSeedFromMnemonic(mnemonic)

  // 4️⃣ Derive Solana account
  const keypair = deriveSolanaKeyPair(seed, 0)

  return {
    mnemonic,
    keypair,
    publicKey: keypair.publicKey.toBase58(),
  }
}
