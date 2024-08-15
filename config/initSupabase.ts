import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";
import { compress, decompress } from "lz-string";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      console.log(`Fetching item with key: ${key}`);
      const storedValue = await SecureStore.getItemAsync(key);
      console.log(
        `Fetched size: ${storedValue ? storedValue.length : 0} bytes`
      );

      if (!storedValue) {
        console.warn(`No value found for key: ${key}`);
        return null;
      }

      const decompressedValue = decompress(storedValue);

      if (!decompressedValue) {
        console.warn(`Decompression failed for key: ${key}`);
        return null;
      }

      console.log(`Decompressed size: ${decompressedValue.length} bytes`);
      return decompressedValue;
    } catch (error) {
      console.error(`Error getting item from SecureStore: ${error}`);
      return null;
    }
  },

  setItem: async (key: string, value: string) => {
    try {
      const compressedValue = compress(value);
      console.log("Compressed size:", compressedValue.length); // Log the size of the compressed value

      await SecureStore.setItemAsync(key, compressedValue);
      console.log(`Stored item with key: ${key}`);
    } catch (error) {
      console.error(`Error setting item in SecureStore: ${error}`);
    }
  },

  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
      console.log(`Removed item with key: ${key}`);
    } catch (error) {
      console.error(`Error removing item from SecureStore: ${error}`);
    }
  },
};

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url!, key!, {
  auth: {
    detectSessionInUrl: false,
    storage: ExpoSecureStoreAdapter,
  },
});
