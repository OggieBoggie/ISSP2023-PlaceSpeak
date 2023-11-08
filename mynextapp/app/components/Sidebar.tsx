import React from 'react';

const Sidebar = () => {
  return (
    <div className="p-5">
      <nav className="flex flex-col">
        <a href="http://127.0.0.1:3000/profile/account" className="text-gray-700 py-2 hover:text-gray-900 hover:underline">account</a>
        <a href="http://127.0.0.1:3000/profile/verfication" className="text-gray-700 py-2 hover:text-gray-900 hover:underline">verification</a>
        <a href="http://127.0.0.1:3000/profile/verfication" className="text-gray-700 py-2 hover:text-gray-900 hover:underline">badges</a>
      </nav>
    </div>
  );
};

export default Sidebar;