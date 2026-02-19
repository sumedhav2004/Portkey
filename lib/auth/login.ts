

export async function loginUser(password: string){
  if(!password) throw new Error("Password is required!")

  const enc = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")

  const storedHash = localStorage.getItem("USER_PASSWORD_HASH")

  if(hash === storedHash) localStorage.setItem("IS_LOGGED_IN","true")
}