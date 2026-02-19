const decoder = new TextDecoder()
const encoder = new TextEncoder()

export async function decryptMnemonic(
  encryptedPayload: string,
  password: string
): Promise<string> {

  const { salt, iv, data } = JSON.parse(encryptedPayload)

  // 1️⃣ Re-import password
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  // 2️⃣ Derive SAME key
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  )

  // 3️⃣ Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data)
  )

  return decoder.decode(decrypted)
}
