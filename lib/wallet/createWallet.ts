import { createMnemonic } from "@/lib/crypto/createMnemonic"
import { encryptMnemonic } from "@/lib/crypto/encrypt"
import { saveEncryptedMnemonic } from "@/lib/storage/walletStorage"

export async function createWallet(password: string) {
  // steps go here
  const mnemonic = createMnemonic();
  const encrypted = await encryptMnemonic(mnemonic, password);

  saveEncryptedMnemonic(encrypted);

  return mnemonic

}
