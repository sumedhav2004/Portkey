'use client'

import Logo from '@/components/self/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { decryptMnemonic } from '@/lib/crypto/decrypt'
import { deriveSeedFromMnemonic } from '@/lib/crypto/deriveSeedFromMnemonic'
import { deriveSolanaKeyPair } from '@/lib/crypto/solana/deriveKeypair'
import { loadEncryptedMnemonic } from '@/lib/storage/walletStorage'
import { useWalletStore } from '@/walletStore/store'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const page = (props: Props) => {
  const router = useRouter();
  const [password,setPassword] = useState<string>('');
  const [confirmPassword,setConfirmPassword] = useState<string>('');

  function handleRegister(){
    router.push("/onboarding")
  }

  async function handleLogin(){
    try{
      
      const encrypted = loadEncryptedMnemonic();
      if(!encrypted) return;

      console.log(1)

      const mnemonic = await decryptMnemonic(encrypted,password);
      const seed = await deriveSeedFromMnemonic(mnemonic);
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
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className='w-screen h-screen flex flex-col justify-between p-8 items-center bg-background'>
      <Card className='h-full w-2/5 px-8 flex-col justify-between'>
        <CardHeader>
          <Logo size="200" />
          <CardTitle className='text-7xl'>Portkey</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Input onChange={(e) => setPassword(e.target.value)} required type='password' placeholder='Enter your Password' />
          <Input onChange={(e) => setConfirmPassword(e.target.value)} required type='password' placeholder='Confirm password' />
        </CardContent>
        <CardFooter>
          <div className='flex justify-between items-center w-full'>
            <Button onClick={()=>handleLogin()}>login/Unlock</Button>
            <Button onClick={()=>handleRegister()} variant="outline">register</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default page