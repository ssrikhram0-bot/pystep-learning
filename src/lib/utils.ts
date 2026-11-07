import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with clsx.
 * Combines clsx (conditional class logic) with tailwind-merge
 * (handles Tailwind class conflicts intelligently).
 *
 * @param inputs - Any number of class values (strings, objects, arrays)
 * @returns A merged, conflict-free Tailwind class string
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-6")
 * // => "py-2 bg-blue-500 px-6"  (px-4 overridden by px-6)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
