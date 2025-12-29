import { type ClassValue, clsx } from "clsx"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export { toast }

