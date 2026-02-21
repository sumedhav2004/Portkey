import { getSolBalance } from "@/lib/crypto/solana/getBalance"
import { useWalletStore } from "@/walletStore/store"
import { useEffect, useState, useCallback } from "react"

export const useGetSolBalance = () => {
  const accounts = useWalletStore(s => s.accounts)
  const [balances, setBalances] = useState<Map<string, number>>(new Map())

  const fetchBalances = useCallback(async () => {
    const newBalances = new Map<string, number>()

    for (const account of accounts) {
      const bal = await getSolBalance(account.address)
      newBalances.set(account.address, bal)
    }

    setBalances(newBalances)
  }, [accounts])

  useEffect(() => {
    if (accounts.length > 0) {
      fetchBalances()
    }
  }, [accounts, fetchBalances])

  return { balances, refresh: fetchBalances }
}
