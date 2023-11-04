"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Transition } from "@headlessui/react";

const Profile = () => {
  const { data: session } = useSession();
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserPoints = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/myapp/api/get_user_points/${session?.user?.email}/`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setPoints(data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserPoints();
    }
  }, [session?.user?.email]);

  return (
    <div>
      <div className="flex flex-col items-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <img
            className="mx-auto h-24 w-24 rounded-full"
            src={session?.user?.image ?? "/default-user-image.png"}
            alt={session?.user?.name ?? "Unknown User"}
          />
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            {session?.user?.name ?? "Unknown User"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {session?.user?.email ?? "Email not available"}
          </p>
          <div className="mt-4 text-center">
            {loading ? (
              <p>Loading points...</p>
            ) : (
              <p className="text-lg text-gray-900">Points: {points}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
