import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

async function handlePaste(){
    try{
      const pasted = await navigator.clipboard.readText();
      return pasted;
    }catch(err){
      console.log("Error in pasting",err)
    }
}
