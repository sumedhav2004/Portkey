// hooks/useTokenList.ts
import { useEffect, useState } from "react"

export function useTokenList() {
  const [tokenList, setTokenList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchList() {
      const res = await fetch("https://token.jup.ag/all")
      const data = await res.json()
      setTokenList(data)
      setLoading(false)
    }

    fetchList()
  }, [])

  return { tokenList, loading }
}
