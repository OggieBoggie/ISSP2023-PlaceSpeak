"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Profile from "../components/profile";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        {/* Signed in as {session?.user?.name ?? "Unknown"} <br /> */}
        <Profile />
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
