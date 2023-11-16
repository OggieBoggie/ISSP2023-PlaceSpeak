"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";



function Badges({}) {
    const [badges, setBadges] = useState([]);
    const { data: session } = useSession();
    const userEmail = session?.user?.email;
    useEffect(() => {
        const fetchUserBadges = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/get-badges/${userEmail}`); // Update with your Django API URL
                setBadges(response.data); // Assuming the data is an array of badge objects
            } catch (error) {
                console.error("Error fetching user badges:", error);
            }
        };

        if (userEmail) {
            fetchUserBadges();
        }
    }, [userEmail]);

    return (
        <div className="flex flex-col items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col items-center p-8">
                <h2 className="text-xl font-semibold mb-4">Badges</h2>
                <div className="flex space-x-4 mb-4 justify-between">
                    {badges.map((badge, index) => (
                        <img key={index} src={`/id.svg`} alt={`Verified`} className="w-16 h-16 rounded-full object-cover" />
                    ))}
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50">See All</button>
            </div>
        </div>
    );
}

export default Badges;
// Now mark this as a client component
export const BadgesClient = 'use client';