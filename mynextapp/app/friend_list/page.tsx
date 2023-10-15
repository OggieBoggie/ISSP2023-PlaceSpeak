"use client";
import FriendCard from '../components/FriendCard'
import { users } from './users'
import { useState } from 'react';

export default function Friend() {
    const [showMenu, setShowMenu] = useState<number | null>(null);
    
    function toggleMenu(id: number) {
        // If the clicked menu is already open, close it (set to null). Otherwise, open it (set to the user's ID).
        setShowMenu(prevId => (prevId === id ? null : id));
    }

    const mappedUsers = users.map((user, index) => {
        return (
            <FriendCard
                key={index}
                image={user.image}
                name={user.name}
                location={user.location}
                description={user.description}
                birthday={user.birthday}
                isMenuVisible={showMenu === index}
                toggleMenu={() => toggleMenu(index)}
            />
        );
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-sm">
                {mappedUsers}
            </div>
        </main>
    )
}