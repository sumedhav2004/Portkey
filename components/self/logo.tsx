"use client"

import { motion } from "framer-motion"
type LogoProps = {
  size: string
}
export default function Logo({size}:LogoProps) {
  return (
    <motion.div
      className="relative inline-block"
      animate={{
        y: [0, -4, 0],
        rotate: [0, 0.6, 0],
      }}
      transition={{
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {/* Ambient premium glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
        animate={{
          opacity: [0.18, 0.28, 0.18],
          scale: [0.96, 1.04, 0.96],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(100,68,213,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <motion.img
        src="/Wallet_Logo.png"
        alt="logo"
        className={`relative z-10 select-none`}
        draggable={false}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          width: `${size}px`
        }}
      />
    </motion.div>
  )
}
