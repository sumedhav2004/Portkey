
const WALLET_STORAGE_KEY = "wallet:encrypted-mnemonic"

export function saveEncryptedMnemonic(encrypted: string): void {
  localStorage.setItem(WALLET_STORAGE_KEY, encrypted)
}

export function loadHashedPassword(): string | null {
  return localStorage.getItem("USER_PASSWORD_HASH")
}

export function loadEncryptedMnemonic(): string | null {
  return localStorage.getItem(WALLET_STORAGE_KEY)
}

export function clearWallet(): void {
  localStorage.removeItem(WALLET_STORAGE_KEY)
}


