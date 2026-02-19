import { mnemonicToSeedSync } from "bip39";

export function deriveSeedFromMnemonic(mnemonic: string){
  const seed = mnemonicToSeedSync(mnemonic)
  return seed;
}