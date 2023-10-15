"use client";
import { all } from 'axios';
import FriendCard from '../components/FriendCard'
import { users } from './users'
import { useState } from 'react';

export default function Friend() {
    const [showMenu, setShowMenu] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState(''); 
    const [searchFilter, setSearchFilter] = useState(users);    
    
    function toggleMenu(id: number) {
        // If the clicked menu is already open, close it (set to null). Otherwise, open it (set to the user's ID).
        setShowMenu(prevId => (prevId === id ? null : id));
    }

    function handeleSearchChange(event: any) {
        const value = event.target.value;
        setSearchValue(prevValue => value);
        if (value === '') {
            setSearchFilter(users);
        } else {
            const results = users.filter(user => {
                return user.name.toLowerCase().includes(value.toLowerCase());
            });
            setSearchFilter(results);
        }
    }

    const mappedUsers = searchFilter.map((user, index) => {
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
            {/* Search Input */}
            <input
            type='text'
            placeholder='Search for a friend'
            value={searchValue}
            onChange={handeleSearchChange}
            className="p-4 w-full max-w-xl mb-8 rounded-lg shadow-lg bg-white text-gray-900 placeholder-gray-500 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            {/* User Cards */}
            <div className="z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-sm">
                {mappedUsers}
            </div>
        </main>
    )
}