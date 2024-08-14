import React, {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/config/initSupabase";
// Create a context that listens to the state of the supabase session

// We use the supabase SDK to listen, if we get a user we update the state, if not we also update it, and we will wrap the app with these updates

type AuthProps = {
  user: User | null;
  session: Session | null;
  initalized?: boolean;
  signOut?: () => void;
};

// 1. Provide the global state and functions using CreateContext
export const AuthContext = createContext<Partial<AuthProps>>({});

// 2. Create custom hook to allow components to acccess context values

export function useAuth() {
  return React.useContext(AuthContext);
}

// 3. Create the authprovider component that will use the context object created in step 1. to manage state and accessible functions

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // Log out the user
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    initialized,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
