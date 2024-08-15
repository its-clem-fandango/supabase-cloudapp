import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/provider/AuthProvider";
import { useEffect } from "react";

//useSegments gives us different segments of our path e.g. index is / but new files/folders like an (auth) folder - useSegmentwont give us the entire path?

const InitialLayout = () => {
  const { session, initalized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initalized) return;
    //check if user is trying to navigate to a route in the (auth) folder
    const inAuthGroup = segments[0] === "(auth)";

    // if we have a session in context and we're navigating somewhere not in auth group
    // (login/register,etc) redirect user to list page
    if (session && !inAuthGroup) {
      router.replace("/list");
      // if our session changes, reroute to the login page
    } else if (!session) {
      router.replace("/");
    }
  }, [session, initalized]);
  return <Slot />;
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
};

export default RootLayout;
