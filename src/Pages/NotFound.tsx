import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-black  bg-gray-100 font-primary">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl dark:text-gray-300 text-gray-600 mt-4">
          Oops! Page not found.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
