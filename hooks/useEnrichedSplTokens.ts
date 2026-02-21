import { useEffect, useMemo, useState } from "react"
import { useWalletStore } from "@/walletStore/store"
import { getSplTokenBalances } from "@/lib/crypto/solana/getSplTokenBalances"

type EnrichedToken = {
  mint: string
  amount: number
  symbol: string
  name: string
  logo: string | null
}

export function useEnrichedSplTokens() {
  const accounts = useWalletStore(s => s.accounts)

  const [tokens, setTokens] = useState<EnrichedToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        if (!accounts?.length) return

        setLoading(true)

        // 1️⃣ Fetch balances
        const balances = await getSplTokenBalances(accounts[0].address)

        // 2️⃣ Fetch token list
        const res = await fetch("https://token.jup.ag/all")
        const tokenList = await res.json()

        // 3️⃣ Build fast lookup map
        const tokenMap = new Map()
        tokenList.forEach((token: any) => {
          tokenMap.set(token.address, token)
        })

        // 4️⃣ Merge
        const enriched = balances.map((token: any) => {
          const meta = tokenMap.get(token.mint)

          return {
            mint: token.mint,
            amount: token.balance,
            symbol: meta?.symbol ?? "Unknown",
            name: meta?.name ?? "Unknown Token",
            logo: meta?.logoURI ?? null
          }
        })

        setTokens(enriched)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [accounts])

  return { tokens, loading, error }
}
