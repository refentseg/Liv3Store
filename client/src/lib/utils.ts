import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat("en-ZA",{
  style:'currency',
  currency:'ZAR',
  minimumFractionDigits:2
});

export function currencyFormat(amount:number){
  return 'R ' + (amount/100).toFixed(2);
 }

 export function formatNumber(number: number): string {
  return new Intl.NumberFormat('en-US', { 
      style: 'decimal', 
      maximumFractionDigits: 2 
  }).format(number);
}