"use client"
import Logo from '@/components/self/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerUser } from '@/lib/auth/register'
import { createMnemonic } from '@/lib/crypto/createMnemonic'
import { encryptMnemonic } from '@/lib/crypto/encrypt'
import { saveEncryptedMnemonic } from '@/lib/storage/walletStorage'
import { useWalletStore } from '@/walletStore/store'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const page = (props: Props) => {
  const router = useRouter();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword,setConfirmPassword] = useState<string>('')

  const handleLogin = () => {
    router.push('/login')
  }

  const handleImportWallet = async() =>{
    await registerUser(password,confirmPassword)
    router.push("/onboarding/importWallet")
  }

  const handleCreateWallet = async() => {
    try{
      await registerUser(password, confirmPassword)
      const mnemonic = createMnemonic();
      const encryptedmnemonic = await encryptMnemonic(mnemonic,password)
      saveEncryptedMnemonic(encryptedmnemonic)
      router.push("/onboarding/displayWallet")
      
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className='h-screen w-screen bg-background flex flex-col justify-between items-center p-8 text-white'>
      <h1 className='text-white text-7xl font-semibold'>Portkey</h1>
      <Logo size="200" />

      <div className='w-full max-w-md flex flex-col gap-4'>
        <Input required type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" className='text-white' />
        <Input required type="password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
      </div>

      <div className='flex w-full max-w-xl items-center justify-between'>
        <Button onClick={handleImportWallet} variant="secondary" className=''>Import Wallet</Button>
        <Button onClick={handleCreateWallet} className=''>Generate Wallet</Button>
        <Button variant="outline" onClick={handleLogin}>Login</Button>
      </div>
    </div>
  )
}

export default page