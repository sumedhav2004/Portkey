"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { div } from "framer-motion/client"
import Sidebar  from "../components/self/sidebar"
import { useWalletStore } from "@/walletStore/store"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSolBalance } from "@/lib/crypto/solana/getBalance"
import { Button } from "@/components/ui/button"
import { loadEncryptedMnemonic } from "@/lib/storage/walletStorage"
import { decryptMnemonic } from "@/lib/crypto/decrypt"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowBigLeft, ArrowBigRight, ArrowDownWideNarrow, ArrowDownZA, ArrowUpDown, DollarSign, PlusCircleIcon, PlusSquare, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { deriveSeedFromMnemonic } from "@/lib/crypto/deriveSeedFromMnemonic"
import { deriveSolanaKeyPair } from "@/lib/crypto/solana/deriveKeypair"
import { useCoingecko } from "@/hooks/useCoingecko"
import { useGetSolBalance } from "@/hooks/useGetSolBalance"
import { useEnrichedSplTokens } from "@/hooks/useEnrichedSplTokens"
import { getSplTokenBalances } from "@/lib/crypto/solana/getSplTokenBalances"
import { useTokenList } from "@/hooks/useSplTokenList"
import QRCode from "react-qr-code"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useSendSol } from "@/hooks/useSendSol"
import { Keypair } from "@solana/web3.js"


export default function Home() {
  const router = useRouter()
  const accounts = useWalletStore(s => s.accounts)
  const addAccount = useWalletStore(s => s.addAccount)
  const removeAccount = useWalletStore(s => s.removeAccount)
  const isUnlocked = useWalletStore(s => s.isUnlocked);
  const {balances,refresh} = useGetSolBalance();
  const { tokens } = useEnrichedSplTokens()
  console.log("Special Tokens: ",tokens)
  const {send} = useSendSol()


  const handleSendTransaction = async(keypair: Keypair, address: string, amount: number) => {
    const signature = await send(keypair,address,amount)
    alert("Transaction underway")
    await new Promise(res => setTimeout(res, 700))
    await refresh()
    alert("Transaction successfull")
  }


  const [clicked,setClicked] = useState<string>("no");
  const [password,setPassword] = useState<string>("")
  const [index,setIndex] = useState<number>(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [destinationAddress,setDestinationAddress] = useState<string>("")
  const [amount,setAmount] = useState<number>(0)

  const {realtimeData,loading,error} = useCoingecko();
  async function handleRemove(address: string){
    removeAccount(address);
  }

  async function handleAdd(){
    const encrypted = loadEncryptedMnemonic();
    if(!encrypted) return;

    const mnemonic = await decryptMnemonic(encrypted,password);
    const seed = deriveSeedFromMnemonic(mnemonic)
    const keyPair = deriveSolanaKeyPair(seed,index);
    const newAccount = {
      index,
      keypair: keyPair,
      address: keyPair.publicKey.toBase58(),
    }
    addAccount(newAccount)
    setClicked("no")
  }


  useEffect(() => {
    if (!isUnlocked) {
      router.push("/login")
    }
  }, [isUnlocked,router])




  return (
  <div className="bg-background min-h-screen flex relative overflow-hidden">

    {/* Desktop Sidebar */}
    <div className="hidden lg:block fixed left-0 top-0 h-screen w-80 z-40">
      <Sidebar data={realtimeData || []} />
    </div>

    {/* Mobile Sidebar Overlay */}
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 lg:hidden ${
        isSidebarOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Slide Drawer */}
      <div
        className={`absolute left-0 top-0 h-full w-72 bg-background border-r border-border transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar data={realtimeData || []} />
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 lg:ml-80 flex flex-col min-h-screen w-full px-4 sm:px-6 lg:px-8">

      {/* Top Bar */}
      <div className="flex items-center justify-between py-4 border-b border-border">
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="lg:hidden text-white rounded-md border border-white"
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
          ☰
        </Button>

        <h1 className="text-white font-bold tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Portkey
        </h1>

        <div className="w-8 lg:hidden" /> {/* balance spacing */}
      </div>

      {/* Wallet Grid */}
      <div className="flex-1 py-6">
        <div className="grid gap-6
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-2">

          {accounts.map((account, i) => (
            <Card key={i} className="flex flex-col justify-between p-4">
              
              <CardHeader className="flex justify-between items-center p-0 mb-4">
                <CardTitle className="text-lg sm:text-xl md:text-2xl">
                  {`Wallet ${i + 1}`}
                </CardTitle>

                <Button
                  onClick={() => handleRemove(account.address)}
                  variant="outline"
                  className="border-red-500 text-red-500 rounded-full"
                >
                  <X size={18} />
                </Button>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 p-0">

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {/* <Button variant="secondary" className="flex flex-col text-xs sm:text-sm h-auto hover:text-primary" onClick={()=>setClicked("send")}>
                    <ArrowBigRight size={18} />
                    Send
                  </Button> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="secondary" className="flex flex-col text-xs sm:text-sm h-auto hover:text-primary" onClick={()=>setClicked("send")}>
                        <ArrowBigRight size={18} />
                        Send
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone..
                        </AlertDialogDescription>
                        <Input onChange={(e) => setDestinationAddress(e.target.value)} placeholder="Enter the destination address" className="text-white" />
                        <Input onChange={(e) => setAmount(Number(e.target.value))} placeholder="Enter the amount" type="number" className="text-white" />
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSendTransaction(account.keypair,destinationAddress,amount)}>Send</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* <Button variant="secondary" className="flex flex-col text-xs sm:text-sm h-auto hover:text-primary">
                    <ArrowDownWideNarrow size={18} />
                    Receive
                  </Button> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="secondary"
                        className="flex flex-col text-xs sm:text-sm h-auto hover:text-primary"
                      >
                        <ArrowDownWideNarrow size={18} />
                        Receive
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="w-full flex flex-col items-center">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white text-4xl">
                          Your Wallet Address
                        </AlertDialogTitle>
                      </AlertDialogHeader>

                      <div className="flex justify-center bg-white p-4 rounded-lg">
                        <QRCode
                          value={account.address}
                          size={180}
                        />
                      </div>

                      <p className="break-all text-sm text-white mt-4 text-center">
                        {account.address}
                      </p>

                      <AlertDialogFooter>
                        <AlertDialogAction onClick={() => navigator.clipboard.writeText(account.address)}>Copy Address</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>


                  
                </div>

                {/* Address + Balance */}
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground break-all">
                    {account.address}
                  </p>

                  <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground mt-2">
                    {balances.get(account.address)?.toFixed(2)} SOL
                  </p>
                </div>

              </CardContent>
            </Card>
          ))}

          {/* Add Wallet Card */}
          {accounts.length < 4 && (
            <div className="flex flex-col justify-center items-center bg-accent rounded-xl p-6">
              {clicked === "no" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-white bg-accent-foreground w-24 h-24">
                      <PlusCircleIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-bold underline">
                        Choose one
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setClicked("New")}>
                        Create New Wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setClicked("Import")}>
                        Import New Wallet
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {clicked === "New" && (
                <div className="flex flex-col h-full w-full items-start justify-between">
                  <Button
                    variant="secondary"
                    onClick={() => setClicked("no")}
                    className="max-w-xs"
                  >
                    <ArrowBigLeft />
                  </Button>

                  <Input
                    type="number"
                    placeholder="Wallet index"
                    onChange={(e) => setIndex(Number(e.target.value))}
                  />

                  <Input
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Button onClick={handleAdd}>
                    Create New
                  </Button>
                </div>
              )}

              {clicked === "Import" && (
                <div className="flex flex-col items-start justify-start h-full gap-4 w-full">
                  <Button
                    variant="secondary"
                    onClick={() => setClicked("no")}
                    className="max-w-xs"
                  >
                    <ArrowBigLeft />
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Feature coming soon with multi-chain support.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  </div>
)

}
