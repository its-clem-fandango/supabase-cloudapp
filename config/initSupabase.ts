import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Use a custom secure storage solution for the Supabase client to store the JWT to persist user sessions
// Expo SecureStore provides a way to encrypt and securely store key-value pairs locally on the device
// We pass this to the initalization (connection) of supabase
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Initialize the Supabase client
export const supabase = createClient(url!, key!, {
  auth: {
    detectSessionInUrl: false, //required for RN
    storage: ExpoSecureStoreAdapter, // supabase will automatically use the ExpoSecureStore for sessions
  },
});
