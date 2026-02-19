"use client"

import Logo from '@/components/self/logo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { deriveSeedFromMnemonic } from '@/lib/crypto/deriveSeedFromMnemonic';
import { encryptMnemonic } from '@/lib/crypto/encrypt';
import { deriveSolanaKeyPair } from '@/lib/crypto/solana/deriveKeypair';
import { loadHashedPassword, saveEncryptedMnemonic } from '@/lib/storage/walletStorage';
import { useWalletStore } from '@/walletStore/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { validateMnemonic } from 'bip39';

type Props = {}

const page = (props: Props) => {
  const router = useRouter()

  const [words, setWords] = useState<string[]>([])
  const [checked,setChecked] = useState(false)
  const [mnemonic,setMnemonic] = useState('')
  const [password,setPassword]  = useState('')

  async function handleContinue(){
    try{
      const actualMenmonic = words.join(" ")
      if(!validateMnemonic(actualMenmonic)){
        console.log("Mnemonic not validated")
        alert("Mnemonic not validated")
        return
      }

      const enc = new TextEncoder().encode(password)
      const hashBuffer = await crypto.subtle.digest("SHA-256", enc)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")

      const hashed = loadHashedPassword();

      if(hash !== hashed){
        alert("Wrong password!")
        return
      }

      const encrypted = await encryptMnemonic(actualMenmonic,password)
      saveEncryptedMnemonic(encrypted);

      if(!actualMenmonic) return
      
          const seed = deriveSeedFromMnemonic(actualMenmonic)
            const keypair = deriveSolanaKeyPair(seed,0)
            useWalletStore.getState().unlock(
              actualMenmonic,
              seed,
              {
                index:0,
                keypair,
                address: keypair.publicKey.toBase58()
              }
            )
            router.push('/')
    }catch(err){
      console.log(err)
    }
  }

  async function handlePaste(){
    try{
      const pasted = await navigator.clipboard.readText();
      const sliced = pasted.trim().split(/\s+/);

      setWords(sliced)

    }catch(err){
      console.log("Error in pasting",err)
    }
  }

  
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-between bg-background p-8'>
      <div className='flex justify-start gap-4 w-full max-w-xl items-center '>
        <Logo size="80" />
        <h1 className='text-white text-5xl'>Portkey</h1>
      </div>

      <div className='grid grid-cols-3 grid-rows-4 gap-6 w-full max-w-xl max-h-[60%]'>
        {
          Array.from({length:12}).map((_,i) => (
            <Input
              key={i}
              value={`${words?.[i] ?? ""}`}
              placeholder={`${i+1})`}
              className='border-border border text-white'
              required
              onChange={(e) => {
                const copy = [...words]
                copy[i] = e.target.value.trim()
                setWords(copy)
              }}
            />
          ))
        }
        <Button onClick={handlePaste} variant="secondary" className=''>Paste</Button>
        
      </div>

      <Input placeholder='Enter your password' type='password' className='text-white max-w-xl' onChange={(e) => setPassword(e.target.value)} required />

      <div className='flex w-full items-center justify-between max-w-xl'>
        <div className='flex gap-2 items-center'>
          <Checkbox checked={checked} onCheckedChange={(val) => setChecked(!!val)} />
          <p className='text-white'>I have checked the mnemonic and entered password</p>
        </div>
        <Button onClick={handleContinue} variant='outline' disabled={!checked} className='text-white'>Continue</Button>
      </div>


    </div>
  )
}

export default page