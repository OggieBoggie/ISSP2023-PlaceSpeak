"use client";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function capitalizeFirstLetter(string: any) {
    if (!string) return ''; // Handle falsy input like null, undefined, ''
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/myapp/api/users");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const usersData = await response.json();
      const currentUserData = usersData.find(
        (user: User) => user.email === session?.user?.email
      );
      setCurrentUser(currentUserData);
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  } , []);
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-start mb-4">
        <a href="http://127.0.0.1:3000/profile/account"
        className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center">
          Edit Profile
        </a>
      </div>
      <div className="flex justify-start space-x-4 mb-4">
      {currentUser?.twitter_x_url && (
        <a href={currentUser.twitter_x_url} target="_blank" rel="noopener noreferrer">
          <img src="/twitter.svg" alt="Twitter" className="w-6 h-6" />
        </a>
      )}
      {currentUser?.facebook_url && (
        <a href={currentUser.facebook_url} target="_blank" rel="noopener noreferrer">
          <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
        </a>
      )}
      {currentUser?.linkedin_url && (
        <a href={currentUser.linkedin_url} target="_blank" rel="noopener noreferrer">
          <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
        </a>
      )}
    </div>
      <div className="flex flex-col space-y-2">
        {currentUser?.birthday && (
        <div className="flex justify-between">
          <span className="font-bold text-gray-700">Birthday:</span>
          <span className="text-gray-600">{currentUser?.birthday}</span>
        </div>
        )}
        {currentUser?.gender !== "select" && (
        <div className="flex justify-between">
          <span className="font-bold text-gray-700">Gender:</span>
          <span className="text-gray-600">{capitalizeFirstLetter(currentUser?.gender)}</span>
        </div>
        )}
        {currentUser?.description && (
        <div className="flex justify-between">
          <span className="font-bold text-gray-700">Description:</span>
          <span className="text-gray-600 ml-4">{currentUser?.description}</span>
        </div>
        )}
      </div>
    </div>
  );
}
