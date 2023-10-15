"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const ACTIVE_ROUTE =
  "bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200";
const INACTIVE_ROUTE =
  "text-gray-700 hover:bg-gray-300 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition duration-200";

function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <button onClick={() => signOut()} className={INACTIVE_ROUTE}>
        Sign out
      </button>
    );
  }
  return (
    <button onClick={() => signIn()} className={INACTIVE_ROUTE}>
      Sign in
    </button>
  );
}

export default function NavMenu() {
  const pathname = usePathname();
  return (
    <div className="shadow-md py-2 px-5 z-50 relative">
      <ul className="container mx-auto flex justify-end space-x-5 items-center">
        <Link href="/">
          <li className={pathname === "/" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
            Home
          </li>
        </Link>
        <Link href="/profile">
          <li
            className={pathname === "/profile" ? ACTIVE_ROUTE : INACTIVE_ROUTE}
          >
            Profile
          </li>
        </Link>
        <Link href="/polls">
          <li className={pathname === "/polls" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
            Polls
          </li>
        </Link>
        <li>
          <AuthButton />
        </li>
      </ul>
    </div>
  );
}
