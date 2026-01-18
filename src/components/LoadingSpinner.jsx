function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg animate-pulse text-gray-600 dark:text-gray-300 font-medium">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
