"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Transition } from "@headlessui/react";
import VerificationBar from "./VerificationBar";

const Profile = () => {
  const { data: session } = useSession();
  const [points, setPoints] = useState<number>(0);
  const [verificationLevel, setVerificationLevel] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/myapp/api/users");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const usersData = await response.json();
      setUsers(usersData);

      const currentUserData = usersData.find(
        (user: User) => user.email === session?.user?.email
      );
      setPoints(currentUserData ? currentUserData.points : 0);
      setVerificationLevel(currentUserData ? currentUserData.level : 0);
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

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
              <p className="text-lg text-gray-900">Pinpoints: {points}</p>
            )}
          </div>
          <div className="mt-6 text-center border-t-2 border-gray-200 pt-4">
            <p className="text-lg text-gray-900">
              You're {verificationLevel}/3 levels verified
            </p>

            <div className="mt-4">
              <VerificationBar level={verificationLevel} />
            </div>
            <div className="mt-4">
              <a
                href="http://127.0.0.1:3000/profile/verfication"
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                Level up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
