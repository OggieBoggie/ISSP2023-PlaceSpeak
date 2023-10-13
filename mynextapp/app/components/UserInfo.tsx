"use client";

import { useSession } from "next-auth/react";

export default function UserInfo() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <span className="font-bold text-gray-700">Phone:</span>
          <span className="text-gray-600">123-456-7890</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-gray-700">Address:</span>
          <span className="text-gray-600">123 Main St, Anytown, USA</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-gray-700">Birthday:</span>
          <span className="text-gray-600">January 1, 2000</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold text-gray-700">Gender:</span>
          <span className="text-gray-600">Female</span>
        </div>
      </div>
    </div>
  );
}
