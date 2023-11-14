"use client";
import React, { useEffect, useState } from "react";
import FriendCard from '../components/FriendCard';

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const UsersPage: React.FC = async () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchValue, setSearchValue] = useState(''); 
    const [searchFilter, setSearchFilter] = useState<User[]>([]); 
    const [showMenu, setShowMenu] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch("http://127.0.0.1:8000/myapp/api/users");
            const data: User[] = await res.json();
            setUsers(data);
            setSearchFilter(data);  // Initialize search filter with all users
        })();
    }, []);

    function toggleMenu(id: number) {
        setShowMenu(prevId => (prevId === id ? null : id));
    }

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setSearchValue(value);
        if (value === '') {
            setSearchFilter(users);
        } else {
            const results = users.filter(user => 
                user.name.toLowerCase().includes(value.toLowerCase())
            );
            setSearchFilter(results);
        }
    }

    const session = await getServerSession();
    if (session && session.user) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-start p-24">
                {/* Search Input */}
                <input
                    type='text'
                    placeholder='Search for a friend'
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="p-4 w-full max-w-xl mb-8 rounded-lg shadow-lg bg-white text-gray-900 placeholder-gray-500 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {/* User Cards */}
                <div className="z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-sm">
                    {searchFilter.map((user, index) => (
                        <FriendCard
                            key={index}
                            image={user.image || undefined}
                            name={user.name}
                            email={user.email}
                            location={user.location || undefined}
                            description={user.description || undefined}
                            birthday={user.birthday || undefined}
                            isMenuVisible={showMenu === index}
                            toggleMenu={() => toggleMenu(index)}
                        />
                    ))}
                </div>
            </main>
        );
    } return redirect('/');
};

export default UsersPage;