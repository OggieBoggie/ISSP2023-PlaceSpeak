"use client";

import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col items-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <img
          className="mx-auto h-24 w-24 rounded-full"
          src={session?.user?.image ?? "/default-user-image.png"}
          alt={session?.user?.name ?? "Unknown"}
        />
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          {session?.user?.name ?? "Unknown"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {session?.user?.email ?? "Unknown"}
        </p>
      </div>
    </div>
  );
}
