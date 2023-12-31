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
                const response = await axios.get(`http://127.0.0.1:8000/myapp/api/get-badges/${userEmail}`);
                // Limit the number of badges to 6
                const limitedBadges = response.data.slice(0, 6);
                setBadges(limitedBadges);
                console.log("Badges:", limitedBadges);
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
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">Badges</h2>
                {/* Create a grid container with 2 rows and 3 columns */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {badges.map((badge, index) => (
                        <img key={index} src={badge.image} alt={badge.name} className="w-16 h-16 rounded-full object-cover" />
                    ))}
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-50">See All</button>
            </div>
        </div>
    );
}
export default Badges;

