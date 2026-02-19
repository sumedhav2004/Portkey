import { generateMnemonic, mnemonicToSeedSync } from "bip39";

export function createMnemonic(){
  const mnemonic = generateMnemonic();
  return mnemonic
}