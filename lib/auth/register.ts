

export async function registerUser(
  password: string,
  confirmPassword: string
) {
  if (!password) throw new Error("Password required")
  if(localStorage.getItem("USER_PASSWORD_HASH")) throw new Error("Wallets and password already exist, Login instead")

  if (password !== confirmPassword)
    throw new Error("Passwords don't match")

  if (password.length < 8)
    throw new Error("Minimum 8 characters")

  // Hash before storage (still not production-secure)
  const enc = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")

  localStorage.setItem("USER_PASSWORD_HASH", hash)
}
