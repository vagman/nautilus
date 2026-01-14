import React from 'react';

function PageTitle({ children, className = '' }) {
  return (
    <h1
      className={`text-2xl md:text-3xl font-bold text-center mb-8 mt-12 md:mt-4 text-[#333] dark:text-white transition-colors ${className}`}
    >
      {children}
    </h1>
  );
}

export default PageTitle;
