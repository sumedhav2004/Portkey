'use client'

import { walletExists } from "@/lib/storage/walletStorage"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function WalletLayout({ children }: Props) {
  if (!walletExists()) redirect("/create")

  return (
    <div>
      <div>Sidebar</div>
      <main>{children}</main>
    </div>
  )
}
