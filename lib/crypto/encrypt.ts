const encoder = new TextEncoder()

export async function encryptMnemonic(
  mnemonic: string,
  password: string
): Promise<string> {

  // 1️⃣ Generate randomness
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // 2️⃣ Convert password → key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  // 3️⃣ Derive AES encryption key from password
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  )

  // 4️⃣ Encrypt mnemonic
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(mnemonic)
  )

  // 5️⃣ Package everything needed for decryption
  const payload = {
    salt: Array.from(salt),
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  }

  return JSON.stringify(payload)
}
