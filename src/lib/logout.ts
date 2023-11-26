import { GlobalStorage } from "@/store/globalStorage";
import { redirect } from "react-router-dom";

export async function logout() {
    try {
      // Clear the spliceDb
      await GlobalStorage.clear();
      redirect('/')
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }