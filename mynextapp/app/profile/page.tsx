// "use client";
// import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Profile from "../components/Profile";
import UserInfo from "../components/UserInfo";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
const DynamicMapWithLocation = dynamic(
  () => import("../components/MapWithLocation"),
  {
    ssr: false, // This will load the component only on client side
    loading: () => (
      <p className="text-lg font-bold text-center text-blue-500">Loading...</p>
    ),
  }
);

export default async function Component() {
  const session = await getServerSession();
  if (session && session.user) {
    return (
      <div
        className="bg-gray-100 flex flex-col min-h-screen"
        style={{ minHeight: "calc(100vh - 3.25rem)" }}
      >
        <div className="flex flex-col md:flex-row md:flex-grow">
          <div className="flex-1 p-4 md:max-w-md">
            <Profile />
          </div>

          <div className="w-full md:w-2/3 p-4 mt-4 md:mt-8">
            <UserInfo />
            <div className="flex-grow relative">
              <DynamicMapWithLocation />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return redirect("/");
}
