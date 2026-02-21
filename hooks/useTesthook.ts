import { useEffect, useState } from "react"
import { getSplTokenBalances } from "@/lib/crypto/solana/getSplTokenBalances"
import { useWalletStore } from "@/walletStore/store"

export const useTestHook = () => {
  const accounts = useWalletStore(s => s.accounts)
  const [splTokenBalances, setSplTokenBalances] = useState<any>(null)

  useEffect(() => {
    async function fetchBalances() {
      if (!accounts?.length) return

      const balances = await getSplTokenBalances(accounts[0].address)
      setSplTokenBalances(balances)
    }

    fetchBalances()
  }, [accounts])

  return { splTokenBalances }
}
