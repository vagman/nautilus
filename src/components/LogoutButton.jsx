import React from 'react';

function LogoutButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors shadow-md"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
