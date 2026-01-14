import React from 'react';

function ErrorMessage({ message }) {
  return (
    <p className="text-red-500 font-bold bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
      Error: {message}
    </p>
  );
}

export default ErrorMessage;
