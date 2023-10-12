"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Profile from "../components/profile";
import dynamic from "next/dynamic";
const DynamicMapWithLocation = dynamic(
  () => import("../components/MapWithLocation"),
  {
    ssr: false, // This will load the component only on client side
    loading: () => <p>Loading...</p>,
  }
);

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        {/* Signed in as {session?.user?.name ?? "Unknown"} <br /> */}
        <Profile />
        <DynamicMapWithLocation />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
