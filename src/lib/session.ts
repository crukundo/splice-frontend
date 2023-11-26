import { storedWallet } from "@/config";
import { GlobalStorage } from "@/store/globalStorage";



export async function getCurrentWallet() {
    try {
      const walletExists = await GlobalStorage.getItem(storedWallet)
  
      if (walletExists !== null) {
        return walletExists;
      } else {
        // Wallet key doesn't exist
        throw new Error('Wallet key not found in spliceDb')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  