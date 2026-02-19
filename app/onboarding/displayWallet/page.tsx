"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { decryptMnemonic } from '@/lib/crypto/decrypt'
import { loadEncryptedMnemonic } from '@/lib/storage/walletStorage'
import React, { useState } from 'react'
import Logo from '@/components/self/logo'
import { Checkbox } from '@/components/ui/checkbox'
import { deriveSeedFromMnemonic } from '@/lib/crypto/deriveSeedFromMnemonic'
import { deriveSolanaKeyPair } from '@/lib/crypto/solana/deriveKeypair'
import { useWalletStore } from '@/walletStore/store'
import { useRouter } from 'next/navigation'

const Page = () => {

  const router = useRouter()
  const [password, setPassword] = useState('')
  const [words, setWords] = useState<string[]>([])
  const [error, setError] = useState('')
  const [checked,setChecked] = useState(false)
  const [mnemonic,setMnemonic] = useState('')


  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      console.log("Copied!")
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  async function handleUnlock() {
    try {
      const encrypted = loadEncryptedMnemonic()
      if (!encrypted) throw new Error("No wallet")

      const actualMnemonic = await decryptMnemonic(encrypted, password)
      setMnemonic(actualMnemonic)

      setWords(actualMnemonic.split(" "))
      setError("")
    } catch {
      setError("Wrong password")
      setWords([])
    }
  }

  async function handleContinue(){
    if(!mnemonic) return

    const seed = deriveSeedFromMnemonic(mnemonic)
      const keypair = deriveSolanaKeyPair(seed,0)
      useWalletStore.getState().unlock(
        mnemonic,
        seed,
        {
          index:0,
          keypair,
          address: keypair.publicKey.toBase58()
        }
      )
      router.push('/')
  }

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-between bg-background p-8'>
      <div className='flex justify-start gap-4 w-full max-w-xl items-center '>
        <Logo size="80" />
        <h1 className='text-white text-5xl'>Portkey</h1>
      </div>

      <div className='max-w-xl flex justify-between w-full'>
        <Input
          placeholder='Enter your password'
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className='max-w-xs text-white'
        />
        <Button onClick={handleUnlock}>
          Unlock
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className='grid grid-cols-3 grid-rows-4 gap-6 w-full max-w-xl max-h-[60%]'>
        {
          Array.from({length:12}).map((_,i) => (
            <Input
              key={i}
              readOnly
              value={`${i+1}) ${words?.[i] ?? ""}`}
              className='border-border border text-white'
            />
          ))
        }
        <Button variant="secondary" className='text-white' onClick={(e) => {copyToClipboard(mnemonic); alert("copied")} }>Copy</Button>
      </div>

      <div className='flex w-full items-center justify-between max-w-xl'>
        <div className='flex gap-2 items-center'>
          <Checkbox checked={checked} onCheckedChange={(val) => setChecked(!!val)} />
          <p className='text-white'>I have copied the mnemonic and kept it safely</p>
        </div>
        <Button onClick={handleContinue} variant='outline' disabled={!checked} className='text-white'>Continue</Button>
      </div>


    </div>
  )
}

export default Page
