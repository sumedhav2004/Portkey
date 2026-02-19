"use client"

import React, { useEffect } from 'react'
import { deriveSeedFromMnemonic } from "@/lib/crypto/deriveSeedFromMnemonic"
import { deriveSolanaKeyPair } from "@/lib/crypto/solana/deriveKeypair"
import { getSolBalance } from '@/lib/crypto/solana/getBalance'
import { getSplTokenBalances } from '@/lib/crypto/solana/getSplTokenBalances'


type Props = {}

const page = (props: Props) => {
  useEffect(() => {

  async function run() {
    const seed = deriveSeedFromMnemonic("force loud segment typical forum people client great vintage kid squirrel runway")
    const keypair = deriveSolanaKeyPair(seed, 0)
    const balance = await getSolBalance(
      keypair.publicKey.toBase58()
    )
    console.log("BALANCE:", balance)

    const accounts = getSplTokenBalances(keypair.publicKey.toBase58());
  }
  run()
}, [])

  return (
    <div className='bg-background h-screen'>page</div>
  )
}

export default page