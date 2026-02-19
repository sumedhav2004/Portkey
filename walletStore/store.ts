import { create } from "zustand"
import { Keypair } from "@solana/web3.js"

type WalletAccount = {
  index: number,
  keypair: Keypair,
  address: string
}

type WalletState = {
  isUnlocked: boolean,
  mnemonic: string | null,
  seed: Buffer | null,
  accounts: WalletAccount [],
  activeIndex: number,
  addAccount: (account: WalletAccount) => void
  removeAccount: (address: string) => void

  unlock: (
    mnemonic: string,
    seed: Buffer,
    firstAccount: WalletAccount
  ) => void

  lock: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  isUnlocked: false,
  mnemonic: null,
  seed: null,
  accounts: [],
  activeIndex: 0,

  unlock: (mnemonic, seed, firstAccount) =>
    set({
      isUnlocked: true,
      mnemonic,
      seed,
      accounts: [firstAccount],
      activeIndex: 0,
    }),

  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account],
    })),

  removeAccount: (address: string) =>
  set((state) => ({
    accounts: state.accounts.filter(acc => acc.address !== address),
  })),


  lock: () =>
    set({
      isUnlocked: false,
      mnemonic: null,
      seed: null,
      accounts: [],
      activeIndex: 0,
    }),
}))