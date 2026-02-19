import { useEffect, useState } from "react";

export const useCoingecko = () => {
  const [realtimeData, setRealtimeData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_COINGECKO_BASE_API_URL}/coins/markets?vs_currency=usd`
        )

        const data = await response.json()
        setRealtimeData(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [])

  return { realtimeData, loading, error }
}
