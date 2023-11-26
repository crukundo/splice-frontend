import { useEffect, useState } from "react";
import { GlobalStorage } from "@/store/globalStorage";

const useLocalStorage = (key: string, initialValue: any) => {

  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const value = await GlobalStorage.getItem(key);
        if (value !== null) {
          setStoredValue(value);
        }
      } catch (error) {
        console.error("Error loading value from spliceDb:", error);
      }
    };

    loadStoredValue();
  }, [key]);

  const setValue = async (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await GlobalStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error("Error updating value in spliceDb:", error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
