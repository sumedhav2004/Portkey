'use client'

import { redirect } from "next/navigation"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function WalletLayout({ children }: Props) {

  return (
    <div>
      <div>Sidebar</div>
      <main>{children}</main>
    </div>
  )
}
